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

my $url = "http://www.joinkfa.com/match_v1/match_info_list.php?match_type=57&s_sido=&s_year=$year&keyword=";
my $dom = getDom($url);

for my $tr ($dom->find('table[class="tb_style05"] tbody tr')->reverse->each) {
	my $td_cols = $tr->find('td');

	my $comp = $td_cols->[1]->all_text;
	$comp =~ /(\d)라운드/;

	my $round = $1;

	my $code = $td_cols->[7]->find('a')->first->attr('onclick');
	$code =~ /\'(.*)\'/;
	$code = $1;

	my $url = "http://www.joinkfa.com/match_v1/match_single_info_list.php?match_idx=$code&Search=Y&page=1&match_type=57&s_year=$year&keyword=&fileType=&__assoClass=1&matchType=match";
	my $dom = getDom($url);

	for my $tr ($dom->find('table[class="tb_style05"] tbody tr')->each) {
		my $match_code = $tr->attr('onclick');
		$match_code =~ /\'(.*)\'/;
		$match_code = $1;

		my $td_cols = $tr->find('td');

		$td_cols->[2]->all_text =~ /(\d+)\.(\d+)\.(\d+)/;
		my $date = "$2/$3/$1";
		
		$td_cols->[3]->all_text =~ /(.*) : (.*)/;
		my $l = trim($1);
		my $r = trim($2);

		my $score = "";
		my $pk = "";
		my $url = "";
		
		my $scoreboard = trim($td_cols->[5]->all_text);
		if ($scoreboard =~ /(\d+) : (\d+)/) {
			$score = "$1:$2";
		}

		if ($scoreboard =~ /\((\d+) PSO (\d+)\)/) {
			$pk = "$1:$2";
		}

		$json .= ",\n" if $match_count++;
		$json .= "{\"round\": $round";
		$json .= ", \"date\": \"$date\"";
		$json .= ", \"l\": \"$l\"";
		$json .= ", \"r\": \"$r\"";
		$json .= ", \"score\": \"$score\"" if $score ne "";
		$json .= ", \"pk\": \"$pk\"" if $pk ne "";
		$json .= ", \"url\": \"${year}_${code}_$match_code\"" if $match_code ne "";
		$json .= "}";
	}
}

$json .= "]\n";
print $json;

sub getDom($) {
	my $url = shift;
	my $html;
	my $dom;

	while (1) {
		$html = get($url);
	 	$dom = Mojo::DOM->new($html);
		last if $dom->find('table[class="tb_style05"]')->size > 0;
	}

	return $dom;
}

sub trim($)
{
	my $text = shift;
	$text =~ s/^\s+|\s+$//g;
	return $text;
}
