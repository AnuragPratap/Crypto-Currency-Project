import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import { Button, LinearProgress, Typography, makeStyles } from '@material-ui/core';
import { numberWithCommas } from '../components/Banner/Carousel';
import CoinInfo from '../components/CoinInfo';
import ReactHtmlParser from "react-html-parser";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  btn:{
     display: "flex",
     flexDirection:"column",
     gap: 10,
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };


  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };




  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const buynow = async (event) => {
    const amount = 500;
    const currency = 'INR';
    const receiptId = '123456'; 
    const response = await fetch('http://localhost:5000/order ', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_fqN8RZbi643u3o", 
      amount, 
     currency ,
      name: "Shriya's Crypto Store", 
      description: "Please Pay the amount to buy the coin",
      image: "https://example.com/your_logo",
      order_id: order.id, 
      handler: async function (response) {
        alert("Payment Successfull");
      },
       
      prefill: { 
          "name": "Shriya Gautam", 
          "email": "shriya.gautam@gmail.com",
          "contact": "9000090000"  
      },
      notes: {
          "address": "Razorpay Corporate Office"
      },
      theme: {
          "color": "#3399cc"
      },
    }


    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
});
    rzp1.open();
    event.preventDefault(); //so that our page will not refresh
  };

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
    <div className={classes.sidebar}>
      <img
        src={coin?.image.large}
        alt={coin?.name}
        height="200"
        style={{ marginBottom: 20 }}
      />
      <Typography variant="h3" className={classes.heading}>
        {coin?.name}
      </Typography>
      <Typography variant="subtitle1" className={classes.description}>
        {ReactHtmlParser(coin?.description.en.split(".")[0])}.
      </Typography>
      <div className={classes.marketData}>
        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Rank:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {numberWithCommas(coin?.market_cap_rank)}
          </Typography>
        </span>

        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Current Price:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {symbol}{" "}
            {numberWithCommas(
              coin?.market_data.current_price[currency.toLowerCase()]
            )}
          </Typography>
        </span>
        <span style={{ display: "flex" }}>
          <Typography variant="h5" className={classes.heading}>
            Market Cap:
          </Typography>
          &nbsp; &nbsp;
          <Typography
            variant="h5"
            style={{
              fontFamily: "Montserrat",
            }}
          >
            {symbol}{" "}
            {numberWithCommas(
              coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .slice(0, -6)
            )}
            M
          </Typography>
        </span>
        <div className={classes.btn}>
        {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
          <Button
          variant="outlined"
          style={{
            width: "100%",
            height: 40,
            backgroundColor: "#4BB3F2",
          }}
          onClick={buynow}
          >
              Buy Now
            </Button>
            </div>
      </div>
    </div>
    <CoinInfo coin={coin} />
  </div>

  )
}

export default CoinPage