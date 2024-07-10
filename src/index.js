document.addEventListener('DOMContentLoaded', () => {
    const URL_PREFIX = 'http://localhost:3000/pups';
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterGoodDogs = false;
  
    // Fetch all pups and display them in the dog bar
    const fetchPups = () => {
      fetch(URL_PREFIX)
        .then(response => response.json())
        .then(pups => {
          displayPups(pups);
        });
    };
  
    const displayPups = (pups) => {
      dogBar.innerHTML = '';
      pups.forEach(pup => {
        if (!filterGoodDogs || pup.isGoodDog) {
          const span = document.createElement('span');
          span.textContent = pup.name;
          span.addEventListener('click', () => showPupInfo(pup));
          dogBar.appendChild(span);
        }
      });
    };
  
    const showPupInfo = (pup) => {
      dogInfo.innerHTML = `
        <img src="${pup.image}" alt="${pup.name}">
        <h2>${pup.name}</h2>
        <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
      const button = dogInfo.querySelector('button');
      button.addEventListener('click', () => toggleGoodDog(pup, button));
    };
  
    const toggleGoodDog = (pup, button) => {
      const newStatus = !pup.isGoodDog;
      fetch(`${URL_PREFIX}/${pup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ isGoodDog: newStatus })
      })
        .then(response => response.json())
        .then(updatedPup => {
          button.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
          pup.isGoodDog = updatedPup.isGoodDog;
        });
    };
  
    filterButton.addEventListener('click', () => {
      filterGoodDogs = !filterGoodDogs;
      filterButton.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`;
      fetchPups();
    });
  
    // Initial fetch of all pups
    fetchPups();
  });
  