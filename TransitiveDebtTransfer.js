function findTransitiveWeightSequence(participantsWeightMap){
  const transactions = [];
  const orderedByWeight = Object.entries(participantsWeightMap).sort((a, b) => a[1] - b[1]);
  const participants = orderedByWeight.map(entry => entry[0]);
  const weights = orderedByWeight.map(entry => entry[1]);

  const sumOfAllWeights = weights.reduce((acc, weight) => acc + weight, 0);
  if (sumOfAllWeights > 0.1){  // 0.1 because fuckin js does not know how to subtract/sum
    throw new Error("Sum of all weights must be 0");
  }
  
  let leftPointer = 0;
  let rightPointer = weights.length - 1;

  while(true){
    if (leftPointer === rightPointer){
      break;
    }

    const leftParticipant = participants[leftPointer];
    const rightParticipant = participants[rightPointer];

    const leftAmount = weights[leftPointer];  // must be negative
    const rightAmount = weights[rightPointer];  // must be positive

    if(leftAmount === 0){
      break;
    }

    if (rightAmount === 0){
      break;
    }

    const remaining = leftAmount + rightAmount;
    if(remaining >= 0){
      transactions.push({
        from: leftParticipant,
        to: rightParticipant,
        amount: -leftAmount
      });
      weights[leftPointer] = 0;
      weights[rightPointer] = remaining;
      leftPointer++;
    }
    else {
      transactions.push({
        from: leftParticipant,
        to: rightParticipant,
        amount: rightAmount
      });
      weights[rightPointer] = 0;
      weights[leftPointer] = remaining;
      rightPointer--;
    }
  }

  return transactions;
}
