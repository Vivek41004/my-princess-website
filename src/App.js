// App.js

import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";

const pastelPink = "#ffe4ec";
const pastelLavender = "#efecff";
const pastelCream = "#fffbe6";
const softGlow = "0 0 20px 4px #ffcef9";
const softFont = "'Quicksand', 'Poppins', 'Nunito', sans-serif";

const scrollAnimation = keyframes`
  0% { opacity: 0; transform: translateY(40px);}
  100% { opacity: 1; transform: translateY(0);}
`;

// Keyframes for interactive heart animation
const heartBurst = keyframes`
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.2);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(0.5); }
  25% { transform: scaleY(1.2); }
  50% { transform: scaleY(0.7); }
  75% { transform: scaleY(1.1); }
`;

const Page = styled.div`
  font-family: ${softFont};
  min-height: 100vh;
  background: linear-gradient(135deg, ${pastelPink}, ${pastelLavender});
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #421a2e;
`;

// New styled component for the navigation bar
const NavBar = styled(motion.nav)`
  width: 100%;
  padding: 1.2rem 1rem;
  background: linear-gradient(90deg, #ffdee9, #c7b4ff); /* Soft gradient for the nav bar */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #7a0b5a;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  filter: drop-shadow(0 0 10px #ffc6e5); /* Soft glow */
  @media (max-width: 600px) {
    font-size: 1.2rem;
    padding: 1rem 0.5rem;
  }
`;

const AnimatedSection = styled(motion.section)`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2.5rem 1.5rem;
  border-radius: 32px;
  box-shadow: 0 6px 24px rgba(196, 154, 177, 0.12);
  background: ${({ bg }) => bg || pastelCream};
  margin-bottom: 2rem;
  position: relative;
  animation: ${scrollAnimation} 1s;
  transition: box-shadow 0.5s;

  @media (max-width: 600px) {
    margin: 2rem 0.25rem;
    padding: 1.25rem 0.5rem;
  }
`;

const Heading = styled.h2`
  font-size: 2.1rem;
  font-family: ${softFont};
  color: #881464;
  text-shadow: ${softGlow};
  margin-bottom: 0.5rem;
`;

const Subline = styled.p`
  font-size: 1.11rem;
  color: #700c47;
  margin-bottom: 1.2rem;
  font-style: italic;
`;

const UmbrellaAnim = styled.div`
  text-align: center;
  margin: 1.6rem 0 0.8rem 0;
`;

const RainDrizzle = styled(motion.div)`
  position: absolute;
  left: 50%; top: 26%;
  transform: translateX(-40%);
  width: 55px;
  height: 30px;
  pointer-events: none;
`;

const Popup = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(97, 29, 62, 0.16);
  z-index: 10;
`;

const PopupBox = styled.div`
  background: ${pastelPink};
  padding: 2rem;
  border-radius: 28px;
  box-shadow: ${softGlow};
  font-size: 1.12rem;
  color: #881464;
  max-width: 340px;
  text-align: center;
  animation: ${scrollAnimation} 0.8s;
`;

const Button = styled(motion.button)`
  background: linear-gradient(90deg, #ffe7e6, #e2d6ff);
  color: #85103b;
  border: none;
  font-size: 1.13rem;
  font-family: ${softFont};
  border-radius: 24px;
  padding: 0.7rem 1.6rem;
  margin-top: 1rem;
  filter: drop-shadow(${softGlow});
  cursor: pointer;
  box-shadow: 0 0 10px 1px #ffd5f5;
  transition: box-shadow 0.3s, transform 0.15s;
  &:active { box-shadow: 0 0 0 0px transparent;}
`;

// Renamed and restyled for interactive animation
const InteractiveSectionContainer = styled(AnimatedSection)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #fce9f4, #e9eaff);
  box-shadow: 0 8px 30px rgba(180, 140, 200, 0.18);
`;

const InteractiveButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  padding: 0.8rem 1.8rem;
  background: linear-gradient(90deg, #ffc7e6, #d6eaff);
  color: #6a0e4a;
  border-radius: 30px;
  box-shadow: 0 0 15px 3px #ffb5e0;
  filter: drop-shadow(0 0 10px #ffb5e0);
  &:hover {
    box-shadow: 0 0 25px 5px #ffb5e0;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 0 8px 2px #ffb5e0;
  }
  position: relative; /* Needed for absolute positioning of sparkles */
  overflow: hidden; /* To clip sparkles if they go outside */
`;

// New styled component for individual sparkles
const Sparkle = styled(motion.div)`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  width: 20px;
  height: 20px;
  font-size: 1.2rem;
  pointer-events: none;
  color: #ff69b4; /* Pink heart color */
  animation: ${heartBurst} 1.2s ease-out forwards;
  text-shadow: 0 0 8px #ffc6e5; /* Soft glow for hearts */
`;

const Diya = styled(motion.div)`
  margin: 1.2rem auto;
  display: block;
  width: 58px; height: 58px;
  background: radial-gradient(ellipse at center, #fff6e0 50%, #f6be7e 100%);
  border-radius: 50%;
  box-shadow: 0 0 25px 13px #fffde7, 0 0 80px 20px #fff0ae;
  position: relative;
  animation: ${pulse} 2.4s infinite alternate; /* Using pulse for diya */
  &:after {
    content: '';
    display: block;
    width: 8px; height: 18px;
    background: linear-gradient(#fff, #fbb200 75%, transparent);
    border-radius: 18px;
    position: absolute;
    left: calc(50% - 4px);
    top: -16px;
    opacity: 0.8;
    box-shadow: 0 0 9px 3px #fffad0;
  }
`;

const WorldMap = styled(motion.div)`
  margin: 2rem auto 1rem auto;
  text-align: center;
  animation: ${pulse} 3.1s infinite alternate; /* Using pulse for world map */
`;

const HeartTrail = styled.div`
  display: inline-block;
  width: 120px; height: 80px;
  position: relative;
  svg {
    position: absolute; left: 0; top: 0;
    width: 100%; height: 100%;
    filter: drop-shadow(0 0 8px #ffc6e5);
  }
`;

const Letter = styled.div`
  font-size: 1.09rem;
  color: #4f1557;
  line-height: 1.76;
  margin-top: 0.8rem;
  background: rgba(255,255,255,0.24);
  padding: 1.1rem 1rem 1.4rem 1rem;
  border-radius: 17px;
  box-shadow: 0 0 16px 2px #e7cef8;
  min-height: 90px;

  .revealed {
    opacity: 1;
    transform: translateY(0px);
    transition: opacity 670ms ease, transform 670ms cubic-bezier(.44,.25,.58,1.01);
  }
  .hidden {
    opacity: 0.11;
    transform: translateY(16px);
  }
`;

// New styled component for the Shiv Side section
const ShivSectionContainer = styled(AnimatedSection)`
  background: linear-gradient(135deg, #e0f2f7, #d0e0f0); /* Soft divine aura */
  color: #2c3e50; /* Darker text for contrast */
  text-align: center;
  padding: 3rem 1.5rem;
  box-shadow: 0 8px 30px rgba(100, 150, 200, 0.2);

  h2 {
    color: #4a69bd; /* Blueish tone for Shiv */
    text-shadow: 0 0 15px rgba(74, 105, 189, 0.5);
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.15rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    color: #34495e;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 15px;
    margin: 2rem auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    filter: drop-shadow(0 0 20px rgba(74, 105, 189, 0.7)); /* Blue glow for image */
  }
`;

const ShivButton = styled(Button)`
  background: linear-gradient(90deg, #6a82fb, #fc5c7d); /* Stronger gradient for the button */
  color: white;
  font-size: 1.2rem;
  padding: 0.9rem 2rem;
  border-radius: 30px;
  box-shadow: 0 0 20px 5px rgba(106, 130, 251, 0.5);
  filter: drop-shadow(0 0 15px rgba(106, 130, 251, 0.7));
  &:hover {
    box-shadow: 0 0 35px 8px rgba(106, 130, 251, 0.7);
    transform: translateY(-3px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 0 10px 3px rgba(106, 130, 251, 0.5);
  }
`;


function FadeInSection({ children, bg, delay = 0.02 }) {
  // Handles reveal-on-scroll for each AnimatedSection
  const ref = useRef();
  const inView = useInView(ref, { margin: "-120px" });
  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.94, delay: delay }
      });
    }
  }, [inView, controls, delay]);

  return (
    <AnimatedSection
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={controls}
      bg={bg}>
      {children}
    </AnimatedSection>
  );
}

export default function App() {
  const [surprise, setSurprise] = useState(false);
  const [umbrellaRain, setUmbrellaRain] = useState(true);
  const [sparkles, setSparkles] = useState([]); // State to manage multiple sparkles
  const buttonRef = useRef(null); // Ref for the interactive button

  // Letter scroll reveal effect
  const letter =
    [
      "Mujhe pura yakeen hai ki hum dono ek dusre ke liye hi bane hain",
      "Chahe zindagi mein kitni bhi problems aayein, main sab dekh lunga",
      "Main hamesha tumhare saath rahunga",
      "Tumhe protect karne ke liye, tumhara khayal rakhne ke liye",
      "Tum meri zimmedari ho, meri princess ho",
      "Main kabhi nahi chahunga ki tum akele feel karo",
      "Na aaj, na kal, kabhi bhi nahi",
      "Agar kabhi tumhe darr lage ya lage sab kuch mushkil hai",
      "Toh bas yaad rakhna main hoon",
      "Hamesha tumhare saath",
      "Hamesha tumhare liye ❤"
    ]
  const [revealedLines, setRevealedLines] = useState(1);

  useEffect(() => {
    if (revealedLines < letter.length) {
      const timeout = setTimeout(() => setRevealedLines(revealedLines + 1), 1300);
      return () => clearTimeout(timeout);
    }
  }, [revealedLines, letter.length]);

  // Umbrella rain drizzle loop
  useEffect(() => {
    setUmbrellaRain(true);
    const t = setTimeout(() => setUmbrellaRain(false), 2800);
    return () => clearTimeout(t);
  }, [umbrellaRain]);

  // Function to handle interactive button click and create sparkles
  const handleInteractiveClick = (event) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const newSparkle = {
        id: Date.now() + Math.random(), // Unique ID for each sparkle
        x: event.clientX - rect.left, // X position relative to the button
        y: event.clientY - rect.top, // Y position relative to the button
      };
      setSparkles((prevSparkles) => [...prevSparkles, newSparkle]);

      // Remove sparkle after its animation duration
      setTimeout(() => {
        setSparkles((prevSparkles) =>
          prevSparkles.filter((s) => s.id !== newSparkle.id)
        );
      }, 1200); // Match animation duration
    }
  };

  // Animations
  const buttonAnim = {
    whileHover: { scale: 1.045, boxShadow: "0 0 32px 7px #f7add9" },
    whileTap: { scale: 0.98 }
  };
  const surpriseAnim = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <Page>
      <NavBar
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        For My Cutest 💖 & Bestest ✨ Princess 👑
      </NavBar>

      {/* Interactive Section */}
      <InteractiveSectionContainer delay={0.05}>
        <Heading as="h3" style={{ fontSize: "1.6rem", marginBottom: "0.5rem", color: "#6a0e4a", textShadow: "0 0 15px 3px #ffb5e0" }}>
          Send a Little Love! ❤️
        </Heading>
        <InteractiveButton ref={buttonRef} {...buttonAnim} onClick={handleInteractiveClick}>
          <span>Click Me! ✨</span>
          {/* Render sparkles */}
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <Sparkle
                key={sparkle.id}
                x={sparkle.x}
                y={sparkle.y}
                initial={{ opacity: 1, scale: 0.2, x: sparkle.x, y: sparkle.y }}
                animate={{ opacity: 0, scale: 1.2, y: sparkle.y - 50 }} // Move up and fade out
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                💖
              </Sparkle>
            ))}
          </AnimatePresence>
        </InteractiveButton>
      </InteractiveSectionContainer>

      {/* Welcome Section */}
      <FadeInSection bg={pastelCream} delay={0.10}>
        <Heading>For My Princess 👑</Heading>
        <Subline>
          Jitni duniya dangerous ho sakti hai... utna hi zyada main tumhare liye safe jagah hoon.
        </Subline>
      </FadeInSection>

      {/* Protection Section */}
      <FadeInSection bg={pastelLavender} delay={0.15}>
        <Heading>You’re Always Protected 🛡</Heading>
        <div>
          <div style={{
            marginBottom: 14,
            fontSize: "1.07rem"
          }}>
            Tum sirf meri bestfriend nahi ho... meri zimmedari ho.<br />
            Jab tak main hoon, tum tak koi takleef nahi pahunch sakti.<br />
            I’ll always be quietly watching over you – just like your shield.
          </div>
          <UmbrellaAnim style={{position: "relative"}}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}>
              <svg width="112" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="56" cy="80" rx="36" ry="10" fill="#dfc7ff" />
                <g>
                  <ellipse cx="68" cy="41" rx="14" ry="14" fill="#b48aff" />
                  <ellipse cx="81" cy="84" rx="7" ry="13" fill="#8f47b3" />
                  <rect x="67" y="55" width="4" height="30" rx="2" fill="#533066" />
                  <ellipse cx="56" cy="83" rx="8" ry="13" fill="#fde7ff" />
                  <rect x="64" y="60" width="3" height="18" rx="1.2" fill="#69388b" />
                  {/* Umbrella */}
                  <path d="M58 38 Q65 17 92 36 Q82 38 68 41 Q56 34 33 36 Q50 19 58 38Z" fill="#ffbce4" stroke="#d469b3" strokeWidth="1.5"/>
                  {/* Girl under umbrella */}
                  <ellipse cx="44" cy="54" rx="11" ry="10" fill="#ffdbea" />
                  <rect x="38" y="62" width="13" height="21" rx="6" fill="#fabbda" />
                </g>
              </svg>
            </motion.div>
            {umbrellaRain && (
              <RainDrizzle
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-4, 11, 19, 26], transition: { duration: 2.3, repeat: Infinity, repeatDelay: 0.5 } }}>
                {/* drizzly rain lines */}
                <svg width="55" height="30">
                  <line x1="9"  y1="0" x2="7"  y2="26" stroke="#b0a3ff" strokeWidth="2" opacity="0.55"/>
                  <line x1="21" y1="3" x2="23" y2="27" stroke="#e8ceff" strokeWidth="1.3" opacity="0.56"/>
                  <line x1="36" y1="5" x2="34" y2="29" stroke="#af71e6" strokeWidth="2" opacity="0.48"/>
                  <line x1="49" y1="0" x2="51" y2="28" stroke="#eecfff" strokeWidth="1.2" opacity="0.54"/>
                </svg>
              </RainDrizzle>
            )}
          </UmbrellaAnim>
        </div>
      </FadeInSection>

      {/* Letter Section */}
      <FadeInSection bg={pastelCream} delay={0.20}>
        <Heading as="h3" style={{fontSize: "1.19rem"}}>A Soft Letter for You ♥</Heading>
        <Letter>
          {letter.map((line, i) => (
            <motion.div
              key={i}
              className={i < revealedLines ? "revealed" : "hidden"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i < revealedLines ? 1 : 0.13, y: i < revealedLines ? 0 : 10 }}
              transition={{ duration: 1.04, delay: i * 0.3 }}>
              {i < revealedLines ? line : " …"}
              <br />
            </motion.div>
          ))}
        </Letter>
      </FadeInSection>

      {/* Prayers Section */}
      <FadeInSection bg={pastelLavender} delay={0.25}>
        <Heading>My Prayers for You 🌙</Heading>
        <Subline>
          Har Prayer main sirf ek dua karta hoon – <br />
          <strong style={{color:"#9d3377"}}>‘Meri Princess hamesha khush rahe, safe rahe.’</strong>
        </Subline>
        <Diya
          animate={{
            scale: [1, 1.06, 1],
            filter: [
              "drop-shadow(0 0 28px #ffd)",
              "drop-shadow(0 0 44px #fff4ba)",
              "drop-shadow(0 0 33px #ffe5b0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        />
      </FadeInSection>

      {/* Surprise Section */}
      <FadeInSection bg={pastelCream} delay={0.30}>
        <Heading as="h4">One Little Surprise!</Heading>
        <Button {...buttonAnim} onClick={() => setSurprise(true)}>Click for a surprise 🍫</Button>
        {surprise &&
          <Popup>
            <motion.div {...surpriseAnim} style={{width:"100%"}}>
              <PopupBox>
                Tum chocolate na bhi lo...<br />
                par <strong>mera pyaar hamesha milega</strong>.<br />
                Yeh sirf tumhare liye 💝
                <Button {...buttonAnim} style={{marginTop:15}} onClick={() => setSurprise(false)}>Close</Button>
              </PopupBox>
            </motion.div>
          </Popup>
        }
      </FadeInSection>

      {/* World Tour Dream Section */}
      <FadeInSection bg={pastelLavender} delay={0.35}>
        <Heading as="h4">World Tour Dream 🌏</Heading>
        <div style={{margin:"13px 0 5px 0", fontSize:"1.08rem"}}>
          Shaadi zaroori nahi...<br />par tumhare saath duniya ghoomna zaroori hai 💫
        </div>
        <WorldMap
          animate={{
            scale: [1, 1.04, 1],
            filter: [
              "drop-shadow(0 0 21px #fff3fb)",
              "drop-shadow(0 0 40px #cba5ff)",
              "drop-shadow(0 0 28px #ffc6ee)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        >
          <HeartTrail>
            <svg viewBox="0 0 120 80">
              <path
                d="M 15 50 Q 35 7, 60 28 T 103 40"
                fill="none"
                stroke="#ff73b5"
                strokeWidth="3"
                strokeDasharray="9,8"
              />
              <path
                d="M108 40
                  Q 114 35, 110 44
                  Q 115 37, 113 50"
                fill="none"
                stroke="#fd6ea6"
                strokeWidth="3"
              />
              <circle cx="15" cy="50" r="4" fill="#ead4ff"/>
              <ellipse cx="108" cy="40" rx="6" ry="3.5" fill="#ffaee2"/>
              <text x="80" y="32" fontSize="20" fill="#ef3f94" style={{fontFamily:softFont}}>✈️</text>
            </svg>
          </HeartTrail>
        </WorldMap>
      </FadeInSection>

      {/* Shiv Side Section */}
      <ShivSectionContainer bg={null} delay={0.40}> {/* Added delay for animation */}
        <h2>My Shiv Side 🔱</h2>
        <p>
          Aapne ab tak meri sirf shaant side dekhi hai <br />
          Lekin main Shiv ka bhakt hoon <br />
          Jab meri Parvati ji (tum) pe koi bhi takleef aayegi <br />
          Toh main puri duniya se lad jaunga <br /><br />

          Mujhe bas tumhara saath chahiye <br />
          Jab tum mere saath ho, toh mujhe kisi bhi andhere se darr nahi <br /><br />

          Jab zarurat padegi, tum mera vikraal roop bhi dekhogi <br />
          Par us roop mein bhi, main sirf tumhare liye hoon <br /><br />

          Main vaada karta hoon <br />
          Ki main hamesha Shiv ji jaise tumhe protect karunga <br />
          Tumhare saath rahunga <br />
          Har janam mein sirf tumhara Shiv banunga <br />
          Aur tum meri Parvati rahegi
        </p>
        {/* Placeholder for Shiv-Parvati Image */}
        <img
          src="/shiv_parvati_protector.jpeg" // Updated image source
          alt="Lord Shiv and Parvati in a protective form"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/a0c4ff/ffffff?text=Image+Not+Found'; }}
        />
        <ShivButton {...buttonAnim}>
          Tum bas mere saath rehna — baaki sab mujh pe chhodo.
        </ShivButton>
      </ShivSectionContainer>

      {/* Footer – Ending */}
      <FadeInSection bg={pastelCream} delay={0.45}>
        <Heading as="h4" style={{color: "#a81774", fontSize:"1.4rem", textShadow: softGlow}}>
          One love. One person. <br />Always you.
        </Heading>
      </FadeInSection>
    </Page>
  );
}
