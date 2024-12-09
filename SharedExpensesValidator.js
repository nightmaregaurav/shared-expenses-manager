function validateSheet() {
  const Timestamp = getCellValue("Raw", "A1");
  const WhoSpent = getCellValue("Raw", "B1");
  const Why = getCellValue("Raw", "C1");
  const HowMuch = getCellValue("Raw", "D1");
  const SplitAmong = getCellValue("Raw", "E1");
  const When = getCellValue("Raw", "F1");
  const Settled = getCellValue("Raw", "G1");

  if(Timestamp != "Timestamp"){
    throw new Error('The sheet is invalid!');
  }

  if(WhoSpent != "Who Spent?"){
    throw new Error('The sheet is invalid!');
  }

  if(Why != "Why?"){
    throw new Error('The sheet is invalid!');
  }

  if(HowMuch != "How Much?"){
    throw new Error('The sheet is invalid!');
  }

  if(SplitAmong != "Split Among?"){
    throw new Error('The sheet is invalid!');
  }

  if(When != "When?"){
    throw new Error('The sheet is invalid!');
  }
  
  if(Settled != "Settled?"){
    throw new Error('The sheet is invalid!');
  }
}

