# go-rank-estimator
## installation:

## Usage:
### multi-game test example:
```bash
cat input_test.json | katago analysis -model kata1-zhizi-b40c768nbt-fdx6c.bin.gz -config config.cfg -analysis-threads 4 -override-config "nnMaxBatchSize=4" > output_test.json
```

### input_test.json example:
```bash
{"id":"foo","initialStones":[["B","Q4"],["B","C4"]],"moves":[["W","P5"],["B","P6"]],"rules":"tromp-taylor","komi":7.5,"boardXSize":19,"boardYSize":19,"analyzeTurns":[0,1,2]}
{"id":"foo2","initialStones":[["B","Q4"],["B","C4"]],"moves":[["W","P5"],["B","P6"]],"rules":"tromp-taylor","komi":7.5,"boardXSize":19,"boardYSize":19,"analyzeTurns":[0,1,2]}
```

## Dependencies
- katago model: [kata1-zhizi-b40c768nbt-fdx6c](https://media.katagotraining.org/uploaded/networks/models/kata1/kata1-zhizi-b40c768nbt-fdx6c.bin.gz)

