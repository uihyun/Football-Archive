use LWP::Simple;
use feature 'unicode_strings';
use utf8;
use Encode;
use File::Slurp 'slurp';
use Mojo::DOM;
use Mojo::Collection;
use DateTime;
binmode(STDOUT, ":utf8");

my $match = $ARGV[0];
$match =~ /(.*)_(.*)_(.*)/;
my $year = $1;
my $round_code = $2;
my $match_code = $3;

my $perl_dir = "/Users/eunmo/dev/fa/perl/test";
chdir $perl_dir;

system "/bin/bash kfacup.sh $year $round_code $match_code";

my $html = decode('cp949', scalar slurp $match_code);
my $dom = Mojo::DOM->new($html);

my $json = "{";

my $tables = $dom->find('table[class="tb01"]');
my $l = get_text($tables->[0]->find('tr')->[1]->all_text);
my $r = get_text($tables->[1]->find('tr')->[1]->all_text);
$json .= "\"l\": \"$l\", \"r\": \"$r\"";

my $pso_tds = $dom->find('table[class="tb04"] tr')->[4]->find('td');
my $pso_l = get_text($pso_tds->[0]->all_text);
my $pso_r = get_text($pso_tds->[2]->all_text);
if (!($pso_l eq '0' || $pso_l eq '') || !($pso_r eq '0' || $pso_r eq '')) {
	$json .= ", \"pso\": \"$pso_l:$pso_r\"";
}

my $tb05s = $dom->find('table[class="tb05"]');

$json .= ", \"starting\":[";
get_players($tb05s->[0]);
$json .= ",";
get_players($tb05s->[1]);
$json .= "]";

$json .= ", \"bench\":[";
get_players($tb05s->[2]);
$json .= ",";
get_players($tb05s->[3]);
$json .= "]";

$json .= ", \"sub\":[";
get_subs($tb05s->[4]);
$json .= ",";
get_subs($tb05s->[5]);
$json .= "]";

$json .= ", \"og\":[";
get_ogs($tb05s->[10]);
$json .= ",";
get_ogs($tb05s->[11]);
$json .= "]";

my $aet_td = get_text($dom->find('table[class="tb06"] tr')->[6]->find('td')->[1]->text);
$json .= ", \"aet\": true" if $aet_td eq 'Y';

$json .= "}";
print $json;

system "rm $match_code";

sub get_ogs($)
{
	my $table = shift;
	my $og_count = 0;
	my $time;
	
	$json .= "\n[";

	for my $tr ($table->find('tbody tr')->each) {
		my $td_cols = $tr->find('td');

		next if $td_cols->size == 0;

		my $number = get_text($td_cols->[1]->text);
		my $name = get_text($td_cols->[0]->text);
		my $minute = remove_extra(get_text($td_cols->[2]->text));

		next if $minute <= 0;
		
		$json .= ",\n" if $og_count++;
		$json .= "{\"number\": $number";
		$json .= ", \"name\": \"$name\"";
		$json .= ", \"minute\": \"$minute\"";
		$json .= "}";
	}
	
	$json .= "]";
}

sub get_subs($)
{
	my $table = shift;
	my $sub_count = 0;
	my $time;

	$json .= "\n[";
	
	for my $tr ($table->find('tbody tr')->each) {
		my $td_cols = $tr->find('td');

		next if $td_cols->size == 0;

		my $state = get_text($td_cols->[0]->text);
		my $player = get_text($td_cols->[1]->text);
		my $number = get_text($td_cols->[2]->text);
		$time = remove_extra(get_text($td_cols->[3]->text)) if $td_cols->size > 3;

		$json .= ",\n" if $sub_count++;
		$json .= "{\"state\": \"$state\", \"name\": \"$player\", \"number\": $number, \"minute\": $time}";
	}
		
	$json .= "]";
}

sub get_players($)
{
	my $table = shift;
	my $player_count = 0;

	$json .= "\n[";

	for my $tr ($table->find('tbody tr')->each) {
		my $td_cols = $tr->find('td');

		next if $td_cols->size == 0;

		my $number = get_text($td_cols->[0]->text);

		my $name = get_text($td_cols->[1]->all_text);
		$name =~ s/ \(.*\)//;

		my $goals = remove_extra($td_cols->[4]->text);
		my $assists = remove_extra($td_cols->[5]->text);
		my $yellows = remove_extra($td_cols->[6]->text);
		my $reds = remove_extra($td_cols->[7]->text);
		
		$json .= ",\n" if $player_count++;
		$json .= "{\"number\": $number";
		$json .= ", \"name\": \"$name\"";
		$json .= ", \"goals\": \"$goals\"" if $goals ne '';
		$json .= ", \"assists\": \"$assists\"" if $assists ne '';
		$json .= ", \"yellows\": \"$yellows\"" if $yellows ne '';
		$json .= ", \"reds\": \"$reds\"" if $reds ne '';
		$json .= "}";
	}
		
	$json .= "]";
}

sub remove_extra($)
{
	my $s = shift;

	$s =~ s/\(.*\)//g;

	return $s;
}

sub get_text($)
{
	my $s = shift;

	$s =~ s/^\s+|\s+$//g;

	return $s;
}
