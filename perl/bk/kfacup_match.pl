use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $match = $ARGV[0];

my $url = "http://www.kfa.or.kr/facup/facupresult.asp?Query=$match";
my $html = get($url);
my $dom = Mojo::DOM->new($html);

my $div = $dom->find('div[class="resultTbl"]')->first;

my $json = "{";

my $table = $div->find('table[class="matchTbl"]')->first;
my $l = $table->find('td[class="score"]')->first->text;
my $r = $table->find('td[class="score"]')->last->text;
$json .= "\"l\": \"$l\", \"r\": \"$r\"";

if ($table->find('td[headers="shootOut"]')->first->text !~ /^0*$/) {
	my $pk_l = $table->find('td[headers="shootOut"]')->first->text;
	my $pk_r = $table->find('td[headers="shootOut"]')->last->text;
	$json .= ", \"pso\": \"$pk_l:$pk_r\"";
}

my $uls = $div->find('ul[class="detail"]');
my $max_minute = "0";

$json .= ", \"starting\":";
get_player_table($uls->[0]);

$json .= ", \"bench\":";
get_player_table($uls->[1]);

$json .= ", \"sub\":";
get_sub($uls->[2]);

$json .= ", \"og\":";
get_og($uls->[3]);

$json .= ", \"aet\": true" if $max_minute >= 105;
$json .= "}";
print $json;

sub get_og($)
{
	my $container = shift;

	$json .= "\n[";

	my $side_index = 0;
	for my $table ($container->find('table')->each) {
		$json .= "," if $side_index++;
		$json .= "\n[";

		get_own_goal($table);

		$json .= "]";
	}
		
	$json .= "]";
}

sub get_own_goal($)
{
	my $table = shift;
	my $og_count = 0;

	for my $tr ($table->find('tbody tr')->each) {
		my $td_col = $tr->find('td');

		$td_col->[0]->text =~ /(\d+)\. (\S+)/;

		my $number = $1;
		my $name = $2;
		my $minute = $td_col->[1]->text;

		next if $minute <= 0;
		
		$json .= ",\n" if $og_count++;
		$json .= "{\"number\": $number";
		$json .= ", \"name\": \"$name\"";
		$json .= ", \"minute\": \"$minute\"";
		$json .= "}";
	}
}

sub get_sub($)
{
	my $container = shift;
	my $side_index = 0;

	$json .= "\n[";
	for my $ul ($container->find('ul[class="changedPlayer"]')->each) {
		$json .= "," if $side_index++;
		$json .= "\n[";

		my $sub_count = 0;
		for my $li ($ul->find('li')->each) {
			my $player = $li->text;
			my $state = lc $li->find('span')->first->text;
			my $time = $li->find('span')->last->text;

			$json .= ",\n" if $sub_count++;
			$json .= "{\"state\": \"$state\", \"name\": \"$player\", \"minute\": $time}";
		}

		$json .= "]";
	}
		
	$json .= "]";
}

sub get_player_table($)
{
	my $ul = shift;
	my $side_index = 0;
		
	$json .= "\n[";
	for my $table ($ul->find('table')->each) {
		$json .= "," if $side_index++;
		$json .= "\n[";

		get_players($table);

		$json .= "]";
	}
		
	$json .= "]";
}

sub get_players($)
{
	my $table = shift;
	my $player_count = 0;

	for my $tr ($table->find('tbody tr')->each) {
		my $td_col = $tr->find('td');
		my $player = $td_col->[0]->text;
		$player =~ /(\d+)\. (\S+)/;

		my $number = $1;
		my $name = $2;

		my $minute = $td_col->[1]->text;
		$max_minute = $minute if $max_minute < $minute;

		my $goals = $td_col->[2]->text;
		my $assists = $td_col->[3]->text;
		my $yellows = $td_col->[4]->text;
		my $reds = $td_col->[5]->text;
		
		$json .= ",\n" if $player_count++;
		$json .= "{\"number\": $number";
		$json .= ", \"name\": \"$name\"";
		$json .= ", \"goals\": \"$goals\"" if $goals ne '';
		$json .= ", \"assists\": \"$assists\"" if $assists ne '';
		$json .= ", \"yellows\": \"$yellows\"" if $yellows ne '';
		$json .= ", \"reds\": \"$reds\"" if $reds ne '';
		$json .= "}";
	}
}
