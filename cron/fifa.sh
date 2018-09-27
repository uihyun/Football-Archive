for i in $(seq 233 287)
do
	curl "localhost:3050/api/fifa/fetch/${i}"
	echo $i
done
