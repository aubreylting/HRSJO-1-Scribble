import React, { useState, useEffect, Suspense } from "react";
import SocketEvents from "../lib/enums/socketEvents";
const ScribbleBoard = React.lazy(() => import("./ScribbleBoard"));

function GameBoard({ initialGameData, initialUserState, socket, userName }) {
  const [gameData, updateGameData] = useState(initialGameData);
  const [users, updateUserData] = useState(initialUserState);
  const [myWord, updateMyWord] = useState();

  useEffect(() => {
    function decrementDrawTimer(message) {
      const updatedGameData = { ...gameData };
      updatedGameData.drawTimer = message.data.drawTimer;
      updatedGameData.currentRound = message.data.currentRound;
      updatedGameData.currentDrawerName = message.data.currentDrawerName;
      updateGameData(updatedGameData);
    }

    function updateWord(message) {
      updateMyWord(message.data);
    }
    socket.on(SocketEvents.DECREMENT_DRAW_TIMER, decrementDrawTimer);
    socket.on(SocketEvents.START_YOUR_TURN, updateWord);

    return () => {
      socket.off(SocketEvents.DECREMENT_DRAW_TIMER, decrementDrawTimer);
      socket.off(SocketEvents.START_YOUR_TURN, updateWord);
    };
  }, [gameData, myWord]);

  let displayMyWord =
    userName === gameData.currentDrawerName ? <div>{myWord}</div> : <></>;

  return (
    <div>
      {displayMyWord}
      <div>Total Rounds: {gameData.totalRounds}</div>
      <div>Current Round: {gameData.currentRound}</div>
      <div>Draw Timer: {gameData.drawTimer}</div>
      <div>Current Drawer: {gameData.currentDrawerName} </div>
      <Suspense fallback={<dev>Loading...</dev>}>
        <ScribbleBoard
          socket={socket}
          currentDrawer={userName === gameData.currentDrawerName}
        />
      </Suspense>
    </div>
  );
}

export default GameBoard;
