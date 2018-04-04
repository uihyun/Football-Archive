use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
binmode(STDOUT, ":utf8");

my $match = $ARGV[0];

my $url = "http://www.worldfootball.net/report/$match";
my $html = get($url);
my $dom = Mojo::DOM->new($html);

my $tables = $dom->find('table[class="standard_tabelle"]');

check_done($tables->[0]);

my $json = "{";
get_sides($tables->[0]);
$json .= ",\n";
get_goals($tables->[1]);

my $player_table_index = get_player_table_index($tables);

if ($player_table_index == -1) {
	$json .= "}";
	print $json;
	exit;
}

$json .= ",\n";

#players on the left side
$json .= "\"players\": {\n";
get_player($tables->[$player_table_index], "l");
$json .= ",\n";
get_player($tables->[$player_table_index+1], "r");
$json .= "}";

get_manager($tables->[$player_table_index+2]);

$json .= "}";
print $json;

sub check_done($)
{
	my $table = shift;

	my $score_td = $table->find('td[class="dunkel"]')->first;

	if ($score_td->find('span')->size) {
		my $score_style = $score_td->find('span')->first->attr('style');
		exit 1 if $score_style =~ '^color';
	}

	if ($score_td->find('div[class="resultat"]')->size) {
		my $score_text = trim($score_td->find('div[class="resultat"]')->first->all_text);
		exit 2 if $score_text =~ '-:-';
	}
}

sub get_sides($)
{
	my $table = shift;

	my $l = trim($table->find('tr')->[0]->find('th')->[0]->all_text);
	my $r = trim($table->find('tr')->[0]->find('th')->[2]->all_text);

	my $score = trim($table->find('div[class="resultat"]')->[0]->all_text);

	$json .= "\"l\": \"$l\", \"r\": \"$r\"";
	
	if ($score =~ /aet|pso/) {
		$json .= ", \"aet\": true";
	}
}

sub get_goals($)
{
	my $table = shift;

	$json .= "\"goals\": [\n";

	my $goals = $table->find('tr');
	for my $goal_index (1 .. $goals->size - 1) {
		my $goal = $goals->[$goal_index]->find('td')->[1];

		next unless $goal;

		my $side = "l";
		$side = "r" if $goal->attr('style') =~ "padding-left";

		my $goal_text = trim($goal->all_text);
		$goal_text =~ /^(.*?)\s(\d+)\.\s*(.*)$/;

		my $scorer = $1;
		my $minute = $2;

		$detail_text = $3;

		my $style_string = "";
		my $assist_string = "";

		if ($detail_text =~ /\//) {
			$detail_text =~ /^\/ (.*?)(\(.*\)|)$/;
			my $style = $1;
			my $assist = $2;
			$style =~ s/^\s*|\s*$//g;
			$style_string = ", \"style\": \"$style\"";
			$assist =~ s/\(|\)//g;
			$assist =~ s/^\s*|\s*$//g;
			$assist_string = ", \"assist\": \"$assist\"" if $assist;
		} else {
			$detail_text =~ /^(\(.*\)|)$/;
			my $assist = $1;
			$assist =~ s/\(|\)//g;
			$assist =~ s/^\s*|\s*$//g;
			$assist_string = ", \"assist\": \"$assist\"" if $assist;
		}

		$json .= "{\"side\": \"$side\", \"scorer\": \"$scorer\", \"minute\": $minute$style_string$assist_string}";
		$json .= ",\n" if $goal_index < $goals->size - 1;
	}
	$json .= "]";
}

sub get_player_table_index($)
{
	my $tables = shift;
	my $index = 2;
	my $tds = $tables->[$index]->find('td');

	return -1 if $tds->size == 0;

	my $td = $tables->[$index]->find('td')->[0];

	if (trim($td->all_text) =~ /Penalty/) {
		get_penalties($tables->[$index]);
		$index++;
	}

	$td = $tables->[$index]->find('td')->[0];
	if (trim($td->all_text) =~ /Incidents/) {
		$index++;
	}

	return $index;
}

sub get_penalties($)
{
	my $table = shift;
	
	$json .= ",\n\"penalties\": [\n";

	my $penalties = $table->find('tr');
	for my $index (1 .. $penalties->size - 1) {
		my $pk = $penalties->[$index]->find('td')->[1];

		next unless $pk;

		my $side = "l";
		$side = "r" if $pk->attr('style') =~ "padding-left";

		my $player = trim($pk->find('a')->[0]->all_text);
		my $text = trim($pk->all_text);

		$text =~ /\s(scores|misses)$/;

		my $result = ($1 =~ /scores/) ? 'true' : 'false';

		$json .= "{\"side\": \"$side\", \"player\": \"$player\", \"result\": $result}";
		$json .= ",\n" if $index < $penalties->size - 1;
	}
	$json .= "]";
}

sub get_player($)
{
	my $table = shift;
	my $side = shift;
	my $count = 0;

	$json .= "\"$side\": {\n\"start\": [\n";
	for my $p ($table->find('tr')->each) {
		if ($p->find('td[colspan="3"]')->size) {
			$json .= "],\n\"sub\": [\n";
			$count = 0;
			next;
		}

		my $tds = $p->find('td');
		my $number = trim($tds->[0]->all_text);
		my $player = trim($tds->[1]->find('a')->[0]->all_text);

		my $sub = trim($tds->[2]->all_text);
		my $sub_string = "";

		if ($sub =~ /(.*)'(.*)'/) {
			$sub_string = ", \"sub\": [$1, $2]";
		} else {
			$sub =~ s/'//;
			$sub_string = ", \"sub\": $sub" if $sub;
		}

		my $card_string = "";
		my $all_text = trim($tds->[1]->all_text);
		if (!($player =~ $all_text)) {
			my $card = $tds->[1];
			$card_type = $card->find('img')->last->attr('alt');
			$card_minute = trim($card->find('span')->last->all_text);
			$card_minute =~ s/'//;
			$card_string = ", \"card\": {\"type\": \"$card_type\", \"minute\": $card_minute}";
		}

		$json .= ",\n" if $count++;
		$json .= "{";
		$json .= "\"number\": $number, " if $number ne '';
		$json .= "\"name\": \"$player\"$sub_string$card_string}";
	}

	$json .= "\n]}";
}

sub get_manager($)
{
	my $table = shift;

	my $l = get_manager_string($table->find('th')->[0]);
	my $r = get_manager_string($table->find('th')->[1]);
	
	$json .= ",\n\"manager\": {\"l\": \"$l\", \"r\":\"$r\"}";
}

sub get_manager_string($)
{
	my $th = shift;

	if ($th->find('a')->size) {
		return trim($th->find('a')->[0]->all_text);
	}

	return "";
}

sub trim($)
{
	my $text = shift;
	$text =~ s/^\s+|\s+$//g;
	return $text;
}

