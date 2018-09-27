use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $league = $ARGV[0];
my $year = $ARGV[1];
my $month = $ARGV[2];

my $url = "https://sports.news.naver.com/kfootball/schedule/index.nhn?year=$year&month=$month&category=$league";
my $html = get($url);
my @lines = split(/\n/, $html);

for my $line (@lines) {
	if ($line =~ /monthlyScheduleModel: (.*),$/) {
		print $1;
		exit;
	}
}

print "{}";
