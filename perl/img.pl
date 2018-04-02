my $filename = '../src/data/teams.js';
open(my $fh, '<:encoding(UTF-8)', $filename) or die;

while (my $row = <$fh>) {
	if ($row =~ /id: (\d+),/) {
		download($1);
	}
}
		
download(2608043);

sub download($)
{
	my $id = shift;
	my $imgSrc = "http://img.uefa.com/imgml/TP/teams/logos/50x50/$id.png";
	system("curl $imgSrc -o ../img/$id.png");
}

