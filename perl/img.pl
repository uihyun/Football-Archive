my $filename = '../src/data/teams.js';
open(my $fh, '<:encoding(UTF-8)', $filename) or die;

while (my $row = <$fh>) {
	if ($row =~ /id: (\d+),/) {
		downloadUEFA($1);
	}
	
	if ($row =~ /id: \'(\D+?)\',/) {
		downloadFIFA($1);
	}
}
		
downloadUEFA(2608043);

sub downloadUEFA($)
{
	my $id = shift;
	my $imgSrc = "https://img.uefa.com/imgml/TP/teams/logos/50x50/$id.png";
	my $file = "../img/$id.png";
	system("[ -f $file ] || curl $imgSrc -o $file");
}

sub downloadFIFA($)
{
	my $id = shift;
	my $imgSrc = "https://img.uefa.com/imgml/flags/100x100/$id.png";
	my $file = "../img/$id.png";
	system("[ -f $file ] || curl $imgSrc -o $file");
}
