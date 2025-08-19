import { motion } from "motion/react";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

export default function CacheHitDiagram() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "API Gateway Processing",
      description:
        "The request hits the API gateway in SJC, which handles authentication, authorization, audit logging, and metrics collection.",
      color: "#6ee7b7", // green-300
    },
    {
      title: "SSD Cache Hit",
      description:
        "Object's metadata and content are found in the local SSD cache in SJC.",
      color: "#60a5fa", // blue-400
    },
    {
      title: "Serve from Cache",
      description:
        "Return the cached object directly to the user in SJC with minimal latency.",
      color: "#f59e0b", // amber-500
    },
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);

    // Progress through steps
    setTimeout(() => setCurrentStep(1), 1000);
    setTimeout(() => setCurrentStep(2), 2000);
    setTimeout(() => setCurrentStep(3), 3000);
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep(0);
    }, 5500);
  };

  useEffect(() => {
    // Auto-start animation on mount
    const timer = setTimeout(startAnimation, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.diagramContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cache Hit Flow</h1>
        <button
          onClick={startAnimation}
          className={styles.animateButton}
          disabled={isAnimating}
        >
          {isAnimating ? "Animating..." : "Start Animation"}
        </button>
      </div>

      <div className={styles.relative}>
        {/* Flow diagram */}
        <div className={styles.flowDiagram}>
          {/* Moving Response Object (square with rounded corners) */}
          <motion.div
            className={styles.movingResponseObject}
            initial={{
              left: "calc(100% - 200px)",
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: currentStep >= 3 ? "60px" : "calc(100% - 200px)",
              opacity: currentStep >= 3 ? 1 : 0,
              scale: currentStep >= 3 ? 1 : 0,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />

          {/* Requester */}
          <div className={styles.component}>
            <motion.div
              className={styles.requesterBox}
              animate={{
                boxShadow:
                  currentStep === 0 || currentStep === 3
                    ? "0 0 20px #6ee7b7"
                    : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.requesterText}>requester</span>

              {/* Request arrow (from right edge of requester box to left edge of API gateway) */}
              <motion.div
                className={styles.requestArrow}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: currentStep >= 1 ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className={styles.requestArrowHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 1 ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Return arrow (amber object path) */}
              <motion.div
                className={styles.returnArrow}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
              <motion.div
                className={styles.returnArrowHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>User Request</span>
          </div>

          {/* API Gateway */}
          <div className={styles.component}>
            <motion.div
              className={styles.apiGatewayBox}
              animate={{
                backgroundColor: currentStep === 1 ? "#6ee7b7" : "#374151",
                boxShadow: currentStep === 1 ? "0 0 20px #6ee7b7" : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.apiGatewayLights}>
                <motion.div
                  className={`${styles.light} ${styles.greenLight}`}
                  animate={{
                    opacity: currentStep === 1 ? [0.5, 1, 0.5] : 0.7,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: currentStep === 1 ? Infinity : 0,
                  }}
                />
                <motion.div
                  className={`${styles.light} ${styles.redLight}`}
                  animate={{
                    opacity: currentStep === 1 ? [1, 0.5, 1] : 0.7,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    repeat: currentStep === 1 ? Infinity : 0,
                  }}
                />
                <motion.div
                  className={`${styles.light} ${styles.blueLight}`}
                  animate={{
                    opacity: currentStep === 1 ? [0.5, 1, 0.5] : 0.7,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    repeat: currentStep === 1 ? Infinity : 0,
                  }}
                />
              </div>

              {/* Arrow to cache (from right edge of API gateway box to left edge of cache) */}
              <motion.div
                className={styles.arrowToCache}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: currentStep >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.div
                className={styles.arrowToCacheHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />

              {/* Return arrow from cache (passes through API gateway) */}
              <motion.div
                className={styles.returnArrowFromCache}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>API Gateway</span>
          </div>

          {/* SSD Cache */}
          <div className={styles.component}>
            <motion.div
              className={styles.ssdCacheBox}
              animate={{
                backgroundColor: currentStep === 2 ? "#60a5fa" : "#374151",
                boxShadow: currentStep === 2 ? "0 0 20px #60a5fa" : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.ssdCacheGrid}>
                <motion.div
                  className={`${styles.ssdCacheItem} ${styles.greenCacheItem}`}
                  animate={{
                    scale: currentStep === 2 ? [1, 1.2, 1] : 1,
                    boxShadow: currentStep === 2 ? "0 0 8px #6ee7b7" : "none",
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: currentStep === 2 ? 2 : 0,
                  }}
                />
                <div
                  className={`${styles.ssdCacheItem} ${styles.redCacheItem}`}
                ></div>
                <div
                  className={`${styles.ssdCacheItem} ${styles.yellowCacheItem}`}
                ></div>
                <div
                  className={`${styles.ssdCacheItem} ${styles.purpleCacheItem}`}
                ></div>
              </div>

              {/* Return arrow to API Gateway (from left edge of cache box to right edge of API gateway) */}
              <motion.div
                className={styles.returnArrowToApiGateway}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.div
                className={styles.returnArrowToApiGatewayHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>SSD Cache</span>
          </div>

          {/* Block Store (unused in cache hit) */}
          <div className={styles.blockStore}>
            <div className={styles.blockStoreBox}>
              <div className={styles.blockStoreGrid}>
                <div
                  className={`${styles.blockStoreItem} ${styles.purpleBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.redBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.greenBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.pinkBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.blueBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.grayBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.yellowBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.greenBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.redBlockStoreItem}`}
                ></div>
              </div>
            </div>
            <span className={styles.blockStoreLabel}>Block Store</span>
            <span className={styles.blockStoreSubLabel}>(Another Region)</span>
          </div>
        </div>

        {/* Legend for moving objects */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColorBox}></div>
            <span className={styles.legendLabel}>Cached Object</span>
          </div>
        </div>

        {/* Step descriptions */}
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              animate={{
                backgroundColor:
                  currentStep === index + 1 ? step.color + "20" : "#1f2937",
                borderColor: currentStep === index + 1 ? step.color : "#374151",
              }}
            >
              <div className={styles.stepContent}>
                <motion.div
                  className={styles.stepNumber}
                  animate={{
                    backgroundColor:
                      currentStep >= index + 1 ? step.color : "#4b5563",
                  }}
                >
                  <span className={styles.stepNumberText}>{index + 1}</span>
                </motion.div>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance indicator */}
        <motion.div
          className={styles.performanceIndicator}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: currentStep === 3 ? 1 : 0,
            y: currentStep === 3 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.performanceIndicatorContent}>
            <span>✓ Cache Hit - Ultra Low Latency Response</span>
            <span className={styles.performanceIndicatorText}>~1ms</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
