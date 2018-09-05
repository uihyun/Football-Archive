use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $id = $ARGV[0];
my $url = "https://www.fifa.com/fifa-world-ranking/ranking-table/men/";
$url .= "/rank=$id/index.html" if $id ne '';
	
my $html = get($url);
my $dom = Mojo::DOM->new($html);

my $json = "{";

if ($id eq '') {
	my $link = $dom->find('div[class="qlink-link-wrap"] a')->first->attr('href');
	$link =~ /rank=(.*)\//;
	$id = $1 + 1;
}

$json .= "\"id\": $id";

my $date = $dom->find('ul[class="slider-list items-1"] li')->first->text;
$json .= ",\n\"date\": \"$date\"";

$json .= ",\n\"ranks\": [";
my $index = 0;

for my $tr ($dom->find('tr[id*="rnk"]')->each) {
	my $td_col = $tr->find('td');

	my $rank = $td_col->[1]->all_text;
	my $team_img = $td_col->[2]->find('img')->first;

	my $team_id = $team_img->attr('title');

	$json .= ",\n" if $index++;
	$json .= "{\"rank\": $rank";
	$json .= ",\"id\": \"$team_id\"";
	$json .= "}";
}

$json .= "]}\n";
print $json;
