import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function App() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isPrepare, setIsPrepare] = useState(false);
  const [isEnemyShaking, setIsEnemyShaking] = useState(false);
  const [isPlayerShaking, setIsPlayerShaking] = useState(false);

  function ifDead(prev, playerAttack, enemyAttackTime) {
    setIsEnemyShaking(true);
    setTimeout(() => setIsEnemyShaking(false), 300);

    if (isPrepare && prev - playerAttack * 3 <= 0) {
      clearTimeout(enemyAttackTime);
      setIsPrepare(false);
      toast.success(
        `You damaged on ${playerAttack * 3} (x3) after prepare! ENEMY DEAD!`
      );
      return 0;
    } else if (prev - playerAttack <= 0) {
      clearTimeout(enemyAttackTime);
      toast.success(`You damaged on ${playerAttack}. ENEMY DEAD!`);
      return 0;
    } else if (isPrepare) {
      setIsPrepare(false);
      toast.success(`You damaged on ${playerAttack * 3} (x3) after prepare!`);
      return prev - playerAttack * 3;
    } else {
      toast.success(`You damaged on ${playerAttack}`);
      return prev - playerAttack;
    }
  }

  function attack() {
    if (enemyHealth === 0)
      return toast.error("Enemy is already dead, you can't attack!");

    const playerAttack = Math.floor(Math.random() * 5) + 17;

    const enemyAttackTime = setTimeout(() => {
      const enemyAttack = Math.floor(Math.random() * 3) + 12;
      setPlayerHealth((prev) => prev - enemyAttack);
      setIsPlayerShaking(true);
      setTimeout(() => setIsPlayerShaking(false), 300);
      toast.error(`Enemy damaged you by ${enemyAttack}`);
    }, 1000);

    setEnemyHealth((prev) => ifDead(prev, playerAttack, enemyAttackTime));
  }

  function defense() {
    if (enemyHealth === 0)
      return toast.error("Enemy is already dead, you will can't defense!");

    const enemyAttackOnShield = Math.floor(Math.random() * 3) + 6;
    setIsPlayerShaking(true);
    setTimeout(() => setIsPlayerShaking(false), 300);
    setPlayerHealth((prev) => prev - enemyAttackOnShield);
    toast.error(
      `Your armor at 50% and enemy damaged on ${enemyAttackOnShield}`
    );
  }

  function prepareForAttack() {
    if (isPrepare)
      return toast.error("You can't prepare, because u are already prepare!");

    if (!enemyHealth) return;

    setIsPrepare(true);
    setIsPlayerShaking(true);
    setTimeout(() => {
      const enemyAttackOnShield = Math.floor(Math.random() * 6) + 24;
      setPlayerHealth((prev) => prev - enemyAttackOnShield);
      toast.error(
        `You prepare of attack on next step. Enemy damaged you by ${enemyAttackOnShield}`
      );
      setIsPlayerShaking(false);
    }, 300);
  }

  return (
    <div className="container">
      <motion.div
        className="player-container just-container"
        animate={{
          x: isEnemyShaking
            ? 350
            : isPlayerShaking
            ? [0, -10, 10, -10, 10, 0]
            : 0,
          rotateZ: isEnemyShaking ? 45 : 0,
          border: isPrepare ? "5px dashed #0efb3d" : "",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="player-image"
          animate={{
            backgroundColor: isPlayerShaking ? "#ff4d4d" : "#ff4d4d0",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="player-info just-info">
            <p>Health: {playerHealth}</p>
            <p>Attack: 17-21</p>
          </div>
        </motion.div>
      </motion.div>
      <div className="btn-container">
        <button onClick={attack}>Attack</button>
        <button onClick={defense}>Defense</button>
        <button onClick={prepareForAttack} disabled={isPrepare}>
          Prepare Attack (x3)
        </button>
      </div>

      <motion.div
        className="enemy-container just-container"
        animate={{
          x: isPlayerShaking
            ? -350
            : isEnemyShaking
            ? [0, -10, 10, -10, 10, 0]
            : 0,
          rotateZ: isPlayerShaking ? -45 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="enemy-image"
          animate={{
            backgroundColor: isEnemyShaking
              ? "#ff4d4d"
              : !enemyHealth
              ? "#00000090"
              : "#ff4d4d0", // Цвет меняется на красный при ударе
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {!enemyHealth && (
            <p
              style={{
                position: "relative",
                fontSize: "50px",
                top: -250,
                left: 140,
                color: "#fff",
              }}
            >
              DEAD
            </p>
          )}
          {enemyHealth && (
            <div className="enemy-info just-info">
              <p>Health: {enemyHealth}</p>
              <p>Attack: 12-15</p>
            </div>
          )}
        </motion.div>
      </motion.div>
      <Toaster
        position="top-center"
        glutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              backgroundColor: "#71e786",
            },
          },
          error: {
            duration: 3000,
            style: {
              backgroundColor: "#e77171",
            },
          },
          style: {
            fontSize: "16px",
            maxWidth: "400px",
            padding: "10px 16px",
            backgroundColor: "#ccc",
            color: "#000",
          },
        }}
      />
    </div>
  );
}

export default App;
