#curl -o emb.png https://www.jleague.jp/img/common/team_emb_l.png
convert -crop 80x80 +repage emb.png %d.png
array=( 0 3 4 6 10 11 13 14 17 18 22 23 25 26 29 30 32 35 36 37 40 42 44 46 47 49 )
for i in "${array[@]}"
do
	num=$(( $i + 200 ))
	cp $i.png ../../img/$num.png
done
