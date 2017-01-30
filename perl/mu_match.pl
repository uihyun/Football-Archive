use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
binmode(STDOUT, ":utf8");

my $match = $ARGV[0];

my $url = "http://www.worldfootball.net/report/$match";
my $html = get($url);
my $dom = Mojo::DOM->new($html);

my $tables = $dom->find('table[class="standard_tabelle"]');

my $header_t = $tables->[0];
my $right_team = $header_t->find('tr')->[0]->find('th')->[2]->all_text;
my $is_right = 0;
$is_right = 1 if $right_team =~ "Manchester United";

my $json = "{r: ";
$json .= "true" if $is_right;
$json .= "false" unless $is_right;
$json .= ", \ngoals: [\n";

#goals
my $goals = $tables->[1]->find('tr');
for $goal_index (1 .. $goals->size - 1) {
	my $goal = $goals->[$goal_index]->find('td')->[1];
	my $goal_text = $goal->all_text;

	my $side = "l";
 	$side = "r" if $goal->attr('style') =~ "padding-left: 50px;";

	$goal_text =~ /^(.*?)\s(\d+)\. \/ (.*?)(\(.*\)|)$/;

	my $scorer = $1;
	my $minute = $2;
	my $style = $3;
	my $assist = $4;
	$assist =~ s/\(|\)//g;
	$assist =~ s/^\s*|\s*$//g;
	my $assist_string = "";
	$assist_string = ", assist: \"$assist\"" if $assist;

	$json .= "{side: \"$side\", scorer: \"$scorer\", minute: $minute, style: \"$style\"$assist_string}";
	$json .= ",\n" if $goal_index < $goals->size - 1;
}
$json .= "],\n";

#players on the left side
get_player($tables->[2], "l");
get_player($tables->[3], "r");
$json .= "}";

print $json;

sub get_player($)
{
	my $table = shift;
	my $side = shift;
	my $count = 0;

	$json .= "players: {\n$side: {\nstart: [\n";
	for my $p ($table->find('tr')->each) {
		if ($p->find('td[colspan="3"]')->size) {
			$json .= "],\nsub: [\n";
			$count = 0;
			next;
		}

		my $tds = $p->find('td');
		my $number = $tds->[0]->all_text;
		my $player = $tds->[1]->find('a')->[0]->all_text;

		my $sub = $tds->[2]->all_text;
		my $sub_string = "";
		$sub =~ s/'//;
		$sub_string = ", sub: $sub" if $sub;

		my $card_string = "";
		if (!($player =~ $tds->[1]->all_text)) {
			my $card = $tds->[1];
			$card_type = $card->find('img')->[0]->attr('alt');
			$card_minute = $card->find('span')->[0]->all_text;
			$card_minute =~ s/'//;
			$card_string = ", card: {type: \"$card_type\", minute: \"$card_minute\"}";
		}

		$json .= ",\n" if $count++;
		$json .= "{number: $number, name: \"$player\"$sub_string$card_string}";
	}

	$json .= "\n]";
}
