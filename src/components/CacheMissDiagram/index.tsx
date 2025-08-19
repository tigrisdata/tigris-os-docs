import { motion } from "motion/react";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

export default function CacheMissDiagram() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [objectCached, setObjectCached] = useState(false);

  const steps = [
    {
      title: "API Gateway Processing",
      description:
        "The request hits the API gateway in the local region, which handles authentication, authorization, audit logging, and metrics collection.",
      color: "#6ee7b7", // green-300
    },
    {
      title: "SSD Cache Miss",
      description:
        "Object's metadata and content are not found in the local SSD cache in the local region.",
      color: "#ef4444", // red-500
    },
    {
      title: "Global Metadata Lookup",
      description:
        "Query the global FoundationDB metadata table to locate the object information and confirm it exists.",
      color: "#8b5cf6", // violet-500
    },
    {
      title: "Retrieve from Another Region",
      description: "Find the object in another region SSD.",
      color: "#06b6d4", // cyan-500
    },
    {
      title: "Replicate to Local SSD",
      description:
        "Store the object metadata and content in the local SSD cache for future requests, and return the object to the user.",
      color: "#10b981", // emerald-500
    },
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);

    // Progress through steps with longer timing for cache miss
    setTimeout(() => setCurrentStep(1), 1000);
    setTimeout(() => setCurrentStep(2), 2000);
    setTimeout(() => setCurrentStep(3), 3500);
    setTimeout(() => setCurrentStep(4), 5000);
    setTimeout(() => {
      setCurrentStep(5);
      setObjectCached(true); // Mark object as cached when it reaches the cache
    }, 6500);
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep(0);
    }, 9000);
  };

  const resetCache = () => {
    setObjectCached(false);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  useEffect(() => {
    // Auto-start animation on mount
    const timer = setTimeout(startAnimation, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.diagramContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cache Miss Flow</h1>
        <div className={styles.buttonContainer}>
          <button
            onClick={startAnimation}
            className={styles.animateButton}
            disabled={isAnimating}
          >
            {isAnimating ? "Animating..." : "Start Animation"}
          </button>
          <button
            onClick={resetCache}
            className={styles.resetButton}
            disabled={isAnimating}
          >
            Reset Cache
          </button>
        </div>
      </div>

      <div className={styles.relative}>
        {/* Flow diagram */}
        <div className={styles.flowDiagram}>
          {/* Moving Object (square with rounded corners) */}
          <motion.div
            className={styles.movingObject}
            initial={{
              left: "calc(100% - 140px)",
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: currentStep >= 5 ? "60px" : "calc(100% - 140px)",
              opacity: currentStep >= 4 ? 1 : 0,
              scale: currentStep >= 4 ? 1 : 0,
            }}
            transition={{
              duration: 2.0,
              ease: "easeInOut",
            }}
          />

          {/* Requester */}
          <div className={styles.component}>
            <motion.div
              className={styles.requesterBox}
              animate={{
                boxShadow:
                  currentStep === 0 || currentStep === 5
                    ? "0 0 20px #6ee7b7"
                    : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.requesterText}>requester</span>

              {/* Request arrow */}
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

              {/* Return arrow */}
              <motion.div
                className={styles.returnArrow}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
              <motion.div
                className={styles.returnArrowHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 1.5 }}
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

              {/* Arrow to cache */}
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

              {/* Return arrow from cache */}
              <motion.div
                className={styles.returnArrowFromCache}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 1.0 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>API Gateway</span>
          </div>

          {/* Local SSD Cache */}
          <div className={styles.component}>
            <motion.div
              className={styles.localSsdCacheBox}
              animate={{
                backgroundColor:
                  currentStep === 2
                    ? "#ef4444"
                    : currentStep === 5
                      ? "#10b981"
                      : "#374151",
                boxShadow:
                  currentStep === 2
                    ? "0 0 20px #ef4444"
                    : currentStep === 5
                      ? "0 0 20px #10b981"
                      : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.ssdCacheGrid}>
                <motion.div
                  className={`${styles.ssdCacheItem} ${styles.grayCacheItem}`}
                  animate={{
                    backgroundColor:
                      currentStep === 2
                        ? "#ef4444"
                        : currentStep >= 5
                          ? "#6ee7b7"
                          : "#6b7280",
                    scale:
                      currentStep === 2
                        ? [1, 0.8, 1]
                        : currentStep === 5
                          ? [1, 1.2, 1]
                          : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: currentStep === 2 || currentStep === 5 ? 2 : 0,
                  }}
                />
                <div
                  className={`${styles.ssdCacheItem} ${styles.blueCacheItem}`}
                ></div>
                <div
                  className={`${styles.ssdCacheItem} ${styles.pinkCacheItem}`}
                ></div>
                {/* New cached object appears here and persists */}
.
                <motion.div
                  className={styles.newCacheItem}
                  initial={{ backgroundColor: "#a855f7", opacity: 0, scale: 0 }}
                  animate={{
                    backgroundColor: objectCached ? "#f59e0b" : "#a855f7",
                    opacity: objectCached ? 1 : 0,
                    scale: objectCached ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: currentStep === 5 ? 1.0 : 0,
                  }}
                />
              </div>

              {/* Arrow to FoundationDB (cache miss path) */}
              <motion.div
                className={styles.arrowToFdb}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.div
                className={styles.arrowToFdbHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 3 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />

              {/* Return arrow from block store */}
              <motion.div
                className={styles.returnArrowFromBlockStore}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.div
                className={styles.returnArrowFromBlockStoreHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 5 ? 1 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>Local SSD Cache</span>
            <span className={styles.componentSubLabel}>(Local Region)</span>
          </div>

          {/* FoundationDB Storage */}
          <div className={styles.component}>
            <motion.div
              className={styles.fdbStorageBox}
              animate={{
                backgroundColor:
                  currentStep === 3 || currentStep === 4
                    ? "#8b5cf6"
                    : "#374151",
                boxShadow:
                  currentStep === 3 || currentStep === 4
                    ? "0 0 20px #8b5cf6"
                    : "none",
                opacity: 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.fdbGrid}>
                <motion.div
                  className={`${styles.fdbItem} ${styles.purpleFdbItem}`}
                  animate={{
                    scale: currentStep === 3 ? [1, 1.2, 1] : 1,
                    boxShadow: currentStep === 3 ? "0 0 8px #8b5cf6" : "none",
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: currentStep === 3 ? 3 : 0,
                  }}
                />
                <motion.div
                  className={`${styles.fdbItem} ${styles.redFdbItem}`}
                  animate={{
                    scale: currentStep === 4 ? [1, 1.2, 1] : 1,
                    boxShadow: currentStep === 4 ? "0 0 8px #06b6d4" : "none",
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    repeat: currentStep === 4 ? 3 : 0,
                  }}
                />
                <div
                  className={`${styles.fdbItem} ${styles.greenFdbItem}`}
                ></div>
                <div
                  className={`${styles.fdbItem} ${styles.pinkFdbItem}`}
                ></div>
                <div
                  className={`${styles.fdbItem} ${styles.blueFdbItem}`}
                ></div>
                <div
                  className={`${styles.fdbItem} ${styles.grayFdbItem}`}
                ></div>
                <div
                  className={`${styles.fdbItem} ${styles.yellowFdbItem}`}
                ></div>
                <div
                  className={`${styles.fdbItem} ${styles.greenFdbItem}`}
                ></div>
                <div className={`${styles.fdbItem} ${styles.redFdbItem}`}></div>
              </div>

              {/* Arrow to block store */}
              <motion.div
                className={styles.arrowToBlockStore}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: currentStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.8, delay: 1.0 }}
              />
              <motion.div
                className={styles.arrowToBlockStoreHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.8, delay: 1.0 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>FoundationDB</span>
            <span className={styles.componentSubLabel}>Global Storage</span>
          </div>

          {/* Block Store */}
          <div className={styles.component}>
            <motion.div
              className={styles.blockStoreBox}
              animate={{
                backgroundColor: currentStep === 4 ? "#06b6d4" : "#374151",
                boxShadow: currentStep === 4 ? "0 0 20px #06b6d4" : "none",
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.blockStoreGrid}>
                <div
                  className={`${styles.blockStoreItem} ${styles.blueBlockStoreItem}`}
                ></div>
                <motion.div
                  className={`${styles.blockStoreItem} ${styles.amberBlockStoreItem}`}
                  animate={{
                    scale: currentStep === 4 ? [1, 1.2, 1] : 1,
                    boxShadow: currentStep === 4 ? "0 0 8px #f59e0b" : "none",
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: currentStep === 4 ? 2 : 0,
                  }}
                />
                <div
                  className={`${styles.blockStoreItem} ${styles.greenBlockStoreItem}`}
                ></div>
                <div
                  className={`${styles.blockStoreItem} ${styles.purpleBlockStoreItem}`}
                ></div>
              </div>

              {/* Return arrow to local cache */}
              <motion.div
                className={styles.returnArrowToLocalCache}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{
                  scaleX: currentStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
              <motion.div
                className={styles.returnArrowToLocalCacheHead}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
            </motion.div>
            <span className={styles.componentLabel}>Block Store</span>
            <span className={styles.componentSubLabel}>(Another Region)</span>
          </div>
        </div>

        {/* Legend for moving objects */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColorBox}></div>
            <span className={styles.legendLabel}>Retrieved Object</span>
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
            opacity: currentStep === 5 ? 1 : 0,
            y: currentStep === 5 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.performanceIndicatorContent}>
            <span>⚠ Cache Miss - Higher Latency Response</span>
            <span className={styles.performanceIndicatorText}>~50ms</span>
          </div>
        </motion.div>

        {/* Cache persistence indicator */}
        {objectCached && (
          <motion.div
            className={styles.cachePersistenceIndicator}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.cachePersistenceIndicatorContent}>
              <span>✓ Object Now Cached - Future Requests Will Hit Cache</span>
              <span className={styles.cachePersistenceIndicatorText}>
                Ready for ~1ms responses
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}