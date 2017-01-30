use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
binmode(STDOUT, ":utf8");

my $year = $ARGV[0];

my $url = "http://www.worldfootball.net/teams/manchester-united/$year/3/";
my $html = get($url);
my $dom = Mojo::DOM->new($html);
my $comp_count = 0;
my $match_count;
my $comp;
my $json = "[";

for my $tr ($dom->find('div[class="portfolio"] div[class="box"] tr')->each) {
	my $comp_td = $tr->find('td[colspan="8"]');

	if ($comp_td->size) {
		$comp = $comp_td->[0]->all_text;
		$comp =~ s/\d+\/\d+$|\d+$//;
		$comp =~ s/\s+$//;

		$json .= "}\n," if $comp_count++;
		$json .= "{comp: {name: \"$comp\", matches: [\n";

		$match_count = 0;
	} else {
		my $td_col = $tr->find('td');

		if ($td_col->size) {
			my $round = $td_col->[0]->all_text;
			$round =~ s/\.//g;

			my $date = $td_col->[1]->all_text;
			my $place = $td_col->[3]->all_text;
			my $opponent = $td_col->[5]->all_text;
			my $url = $td_col->[6]->find('a')->[0]->attr('href');

			$url =~ s/livesticker\/$//;
			$url =~ s/^\/report//;
			$url =~ s/^\/|\/$//g;

			$json .= ",\n" if $match_count++;
			$json .= "{date: \"$date\", place: \"$place\", round: \"$round\", vs: \"$opponent\", url: \"$url\"}";
		}
	}
}

$json .= "}" if $comp_count;
$json .= "]\n";

print $json;
