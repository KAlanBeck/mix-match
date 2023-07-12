import React, { useState } from 'react';

interface DrinkCardProps {
  name: string;
  imgUrl: string;
  id: string;
}

interface drinkDetails {
  quantity?: string | number,
  ingredient: string
}

const DrinkCard: React.FC<DrinkCardProps> = ({ name, imgUrl, id }) => {
  // handleSubmit: send fetch request to backend with drinkId
  const [showModal, setShowModal] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=${id}`);
      const data = await response.json();
      const drink = data.drinks[0];
      
      const details: drinkDetails[] = [];
      // while loop to pull ingredients + quantity
      let ingNum = 1;
      
      while (drink[`strIngredient${ingNum}`]) {
        details.push({
          quantity: drink[`strMeasure${ingNum}`],
          ingredient: drink[`strIngredient${ingNum}`]
        })
        ingNum++
      }
      setIngredients(details.map((detail) => 
      detail.quantity + detail.ingredient));

      setInstructions(drink.strInstructions);

      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const favSubmit = async () => {
    const addDrink = await fetch('/drinks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: name,
        drinkid: id,
        image: imgUrl
      })
    })
  }

  const closeModal = () => {
    setShowModal(false);
  };
  
  return (
    <div className='card'>  
      <h1>{name}</h1>
      <img src={imgUrl} alt={`${name}`}/>
      <button
      onClick={() => handleSubmit()}
      >Instructions</button>
      <button id='heart'
      onClick={() => favSubmit()}>Favorite</button>

      {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>
                    &times;
                  </span>
                  <h2>{name} Instructions</h2>
                  <ul>
                    {ingredients.map((ingredients, index) => (
                      <li key={index}>{ingredients}</li>
                    ))}
                  </ul>
                  <b></b>
                  <div>{instructions}</div>
                </div>
              </div>
            )}
    </div>
  )
}

export default DrinkCard;
