import React, { useEffect, useState} from "react";
import Card from "./Card";
import axios from "axios";

const BASE_API_URL = 'https://deckofcardsapi.com/api/deck'

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawnCard, setDrawnCard] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeck() {
        async function fetchData() {
            const cardDeck = await axios.get(`${BASE_API_URL}/new/shuffle/`);
            setDeck(cardDeck.data)
        }
        fetchData();
    }, []);

    async function draw() {
        try {
            const drawRes = await axios.get(`${BASE_API_URL}/${deck.deck_id}/draw/`);
            if (drawRes.data.remaining === 0) throw new Error("Deck empty!");
            const card = drawRes.data.cards[0];
            setDrawnCard(cardDeck => [
                ...cardDeck,{
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
        } catch (err) {
            alert(err)
        }
    }

    async function shuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${BASE_API_URL}/${deck.deck_id}/shuffle/`);
            setDrawnCard([]);
        } catch (err){
            alert(err);
        } finally {
            setIsShuffling(false)
        }
    }
    
    function renderDrawBtn() {
        if (!deck) return null;
        return (
            <button
            className="Deck-draw"
            onClick={draw}
            disabled={isShuffling}>
                Draw!
            </button>
        )
    }

    function renderShuffleBtn() {
        if (!deck) return null;
        return (
            <button
            className="Deck-shuffle"
            onClick={shuffling}
            disabled={isShuffling}>
                Shuffle Deck!
            </button>
        )
    }

    return (
        <main className="Deck">
            {renderDrawBtn()}
            {renderShuffleBtn()}
            <div className="deck-card-area">
                {drawnCard.map(c => (
                    <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>
        </main>
    )
}

export default Deck;