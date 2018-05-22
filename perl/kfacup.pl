use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $year = $ARGV[0];

my $match_count = 0;
my $index = 1;
my $comp_year;

my $json = "[";

while (1) {

	my $url = "http://www.kfa.or.kr/facup/facuplist.asp?Query=&Page=$index";
	my $html = get($url);
	my $dom = Mojo::DOM->new($html);
	$index++;

	for my $tr ($dom->find('table[class="tblGray schedule"] tbody tr')->each) {
		my $td_col = $tr->find('td');

		next if ($td_col->[1]->all_text eq '');

		my $comp = $td_col->[0]->all_text;
		$comp =~ /(20\d\d)/;
		$comp_year = $1;
		
		next if $comp_year > $year;
		last if $comp_year < $year;

		$comp =~ /(\d)라운드/;
		my $round = $1;

		$td_col->[1]->all_text =~ /(\d+).*?(\d+).*?(\d+)/;
		my $date = "$2/$3/$1";

		$td_col->[2]->all_text =~ /(.*) : (.*)/;
		my $l = $1;
		my $r = $2;

		my $scoreboard = $td_col->[4]->all_text;
		$scoreboard =~ /(\d+) : (\d+)/;
		my $score = "$1:$2";
		my $pk = "";

		if ($scoreboard =~ /\((\d+) PSO (\d+)\)/) {
			$pk = "$1:$2";
		}

		my $url = $td_col->[4]->find('a')->first->attr('href');
		$url =~ s/^.*Query=//;

		$json .= ",\n" if $match_count++;
		$json .= "{\"round\": $round";
		$json .= ", \"date\": \"$date\"";
		$json .= ", \"l\": \"$l\"";
		$json .= ", \"r\": \"$r\"";
		$json .= ", \"score\": \"$score\"";
		$json .= ", \"pk\": \"$pk\"" if $pk ne '';
		$json .= ", \"url\": \"$url\"";
		$json .= "}";
	}

	last if $comp_year < $year;
}

$json .= "]\n";
print $json;
