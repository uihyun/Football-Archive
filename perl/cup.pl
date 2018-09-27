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
		$round =~ s/\.//g;
		$round =~ s/2nd/2/g;
		$round =~ s/3rd/3/g;

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

			if ($cup eq "/all_matches/chn-fa-cup-2017/" && $round eq "3 Round" &&
					$l eq "Qingdao Huanghai" && $r eq "Guangzhou Evergrande") {
				$r = "Guangzhou R&F";
			}

			my $score_td = $td_col->[5];
			my $score = '-:-';
			my $pk = '';

			if ($score_td->find('span')->size == 0 || $score_td->find('span')->first->attr('style') !~ '^color') {
				$score = trim($score_td->all_text);

				if ($score =~ /(\d+:\d+).*(\d:\d+)\) pso/) {
					$score = $2;
					$pk = $1;
				} else {
					$score =~ s/\s\(.*//;
				}
			}

			next if $score =~ "resch";
			
			my $url = getUrl($score_td);

			if ($match_count == 0) {
				$json .= "]}\n," if $round_count++;
				$json .= "{\"name\": \"$round\", \"matches\": [\n";
			}
			
			$json .= ",\n" if $match_count++;
			$json .= "{\"date\": \"$date\", \"l\": \"$l\", \"r\": \"$r\"";
			$json .= ", \"score\": \"$score\"" if $score ne '-:-';
			$json .= ", \"pk\": \"$pk\"" if $pk ne '';
			$json .= ", \"url\": \"$url\"" if $url ne '';
			$json .= "}";
		}
	}
}

$json .= "]}" if $round_count;
$json .= "]\n";

print $json;
print "\n\n\n\n\n";

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

