use LWP::Simple;
use Mojo::DOM;
use Mojo::Collection;
use utf8;
binmode(STDOUT, ":utf8");

my $url = $ARGV[0];

my $url = "http://portal.kleague.com/common/result/result0051popup.do?workingTag=L&$url";
my $html = get($url);
if ($html =~ /jsonResultData = (\[.*?\]);/) {

print $1;
exit;
}

print "[]";
