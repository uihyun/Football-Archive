use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
binmode(STDOUT, ":utf8");

my $cup = $ARGV[0];

my $url = "http://www.worldfootball.net$cup";
my $html = get($url);
my $dom = Mojo::DOM->new($html);
my $round_count = 0;
my $round;
my $match_count;
my $date;
my $json = "[";

for my $tr ($dom->find('div[class="portfolio"] div[class="box"] tr')->each) {
	my $round_th = $tr->find('th');

	if ($round_th->size) {
		$round = $round_th->first->all_text;

		$match_count = 0;
	} else {
		my $td_col = $tr->find('td');	

		if ($td_col->size) {
			if ($td_col->[0]->all_text ne '') {
				$date = $td_col->[0]->all_text;

				# convert: dd/mm/yyyy -> mm/dd/yyyy
				$date =~ /(\d+)\/(\d+)\/(\d+)/;
				$date = "$2/$1/$3";
			}

			next if $td_col->[2]->find('a')->size == 0;

			my $l = trim($td_col->[2]->all_text);
			my $r = trim($td_col->[4]->all_text);

			my $score = trim($td_col->[5]->all_text);

			$score =~ s/\s\(.*//;
			
			my $url = getUrl($td_col->[5]);

			if ($match_count == 0) {
				$json .= "]}\n," if $round_count++;
				$json .= "{\"name\": \"$round\", \"matches\": [\n";
			}
			
			$json .= ",\n" if $match_count++;
			$json .= "{\"date\": \"$date\", \"l\": \"$l\", \"r\": \"$r\"";
			$json .= ", \"score\": \"$score\"" if $score ne '-:-';
			$json .= ", \"url\": \"$url\"" if $url ne '';
			$json .= "}";
		}
	}
}

$json .= "]}" if $round_count;
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

