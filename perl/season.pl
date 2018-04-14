use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
binmode(STDOUT, ":utf8");

my $year = $ARGV[0];
my $team = $ARGV[1];

my $url = "http://www.worldfootball.net/teams/$team/$year/3/";
my $html = get($url);
my $dom = Mojo::DOM->new($html);
my $comp_count = 0;
my $comp;
my $match_count;
my $json = "[";

for my $tr ($dom->find('div[class="portfolio"] div[class="box"] tr')->each) {
	my $comp_td = $tr->find('td[colspan="8"]');

	if ($comp_td->size) {
		$comp = $comp_td->[0]->all_text;

		if ($comp =~ 'Ligue 1') {
			$comp =~ s/\d+\/\d+.*$//;
		} else {
			$comp =~ s/\d+\/\d+.*$|\d+.*$//;
		}

		$comp =~ s/\s+$//;

		next if $comp =~ '^Friendlies' && !($team =~ '-team$');

		my $href = $tr->find('a')->first->attr('href');

		$json .= "]}\n," if $comp_count++;
		$json .= "{\"name\": \"$comp\", \"url\": \"$href\", \"matches\": [\n";

		$match_count = 0;
	} else {
		next if $comp =~ '^Friendlies' && !($team =~ '-team$');

		my $td_col = $tr->find('td');	

		if ($td_col->size) {
			my $round = $td_col->[0]->all_text;
			$round =~ s/\.//g;

			my $date = $td_col->[1]->all_text;

			# convert: dd/mm/yyyy -> mm/dd/yyyy
			$date =~ /(\d+)\/(\d+)\/(\d+)/;
			$date = "$2/$1/$3";

			my $place = $td_col->[3]->all_text;
			my $opponent = $td_col->[5]->all_text;
			$opponent =~ s/^\s+|\s+$//g;

			my $url = getUrl($td_col->[6]);

			next if $url =~ '^dnp$';

			$json .= ",\n" if $match_count++;
			$json .= "{\"date\": \"$date\", \"place\": \"$place\", \"round\": \"$round\", \"vs\": \"$opponent\"";
			$json .= ", \"url\": \"$url\"" if $url ne '';
			$json .= "}";
		}
	}
}

$json .= "]}" if $comp_count;
$json .= "]\n";

print $json;

sub getUrl($)
{
	my $td_col = shift;
			
	my $url_link = $td_col->find('a');

	if ($url_link->size == 0) {
		return (trim($td_col->all_text) eq 'dnp') ? 'dnp' : '';
	}
	return 'dnp' if trim($url_link->[0]->all_text) eq 'dnp';

	my $url = $url_link->[0]->attr('href');

	$url =~ s/liveticker\/$//;
	$url =~ s/^\/report//;
	$url =~ s/^\/|\/$//g;

	return $url;
}

sub trim($)
{
  my $text = shift;
  $text =~ s/^\s+|\s+$//g;
  return $text;
}

