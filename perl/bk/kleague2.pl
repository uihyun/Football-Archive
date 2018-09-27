use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $year = $ARGV[0];
my $month = $ARGV[1];

my $url = "http://portal.kleague.com/view/schedule/list.do?selectYear=$year&selectMonth=$month";
my $html = get($url);
my $dom = Mojo::DOM->new($html);

my $json = "[";
my $count = 0;

for my $span ($dom->find('span[onmouseover]')->each) {
	my $data1 = $span->attr('onmouseover');
	$data1 =~ /\('(.*?)','(.*?)','(.*?)','(.*?)','(.*?)'/;

	my $league = $1;
	my $gameid = $2;
	my $hometeam = $3;
	my $awayteam = $4;
	my $date = $5;

	$date =~ /(\d+)\/(\d+)\/(\d+)/;
	$date = "$2/$3/$1";

	next if $2 !~ /0+$month/;

	my $data2 = $span->find('a')->first->attr('onclick');
	$data2 =~ /\('(.*?)','(.*?)','(.*?)','(.*?)','(.*?)','(.*?)'/;

	my $meetseq = $2;
	my $meetname = $3;
	my $leagueId = $5 - 1;

	next if $leagueId < 1 || $leagueId > 2;

	$league =~ s/ /+/g;

	$json .= ",\n" if $count++;
	$json .= "{'date': '$date', 'home': '$hometeam', 'away: '$awayteam', 'league': $leagueId, ";
	$json .= "'url': 'iptMeetYear=$year&iptMeetSeq=$meetseq&iptGameid=$gameid&iptMeetName=$league'}";
}

$json .= "]";
print $json;
