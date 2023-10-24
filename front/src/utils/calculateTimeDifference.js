const calculateTimeDifference = (date) => {
  const givenDate = new Date(date);

  const currentDate = new Date();

  const timeDifference = currentDate - givenDate;

  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursPassed = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesPassed = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secondsPassed = Math.floor((timeDifference % (1000 * 60)) / 1000);

  console.log(`Nombre de jours passés : ${daysPassed} jours`);
  console.log(`Nombre d'heures passées : ${hoursPassed} heures`);
  console.log(`Nombre de minutes passées : ${minutesPassed} minutes`);
  console.log(`Nombre de secondes passées : ${secondsPassed} secondes`);
};
