import { useEffect, useState } from "react";
import { Power, Droplet, Timer, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

const WRITE_API =
  "https://api.thingspeak.com/update?api_key=28VB3EVNSX0N4IE2";

const READ_API =
  "https://api.thingspeak.com/channels/3259969/feeds.json?api_key=XP2ZYZMV4QHKX03O&results=1";

const LOCK_TIME = 15;

const Node3Control = () => {
  const { t } = useTranslation();

  const [motorStatus, setMotorStatus] = useState(false);
  const [fertilizerStatus, setFertilizerStatus] = useState(false);
  const [valve1Status, setValve1Status] = useState(false);
  const [valve2Status, setValve2Status] = useState(false);

  const [lockTimer, setLockTimer] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  /* ================= FETCH STATUS ================= */
  const fetchStatus = async () => {
    try {
      const res = await fetch(READ_API);
      const json = await res.json();

      if (json.feeds?.length > 0) {
        const data = json.feeds[0];

        setMotorStatus(data.field3 === "1");
        setFertilizerStatus(data.field2 === "1");
        setValve1Status(data.field4 === "1");
        setValve2Status(data.field5 === "1");
      }
    } catch (err) {
      console.error("Read Error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval: any;

    if (lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
    }

    return () => clearInterval(interval);
  }, [lockTimer]);

  /* ================= UPDATE FUNCTION ================= */
  const updateAllFields = async (
    newMotor: number,
    newFertilizer: number,
    newValve1: number,
    newValve2: number
  ) => {
    if (isLocked) return;

    try {
      await fetch(
        `${WRITE_API}&field3=${newMotor}&field2=${newFertilizer}&field4=${newValve1}&field5=${newValve2}`
      );

      setMotorStatus(newMotor === 1);
      setFertilizerStatus(newFertilizer === 1);
      setValve1Status(newValve1 === 1);
      setValve2Status(newValve2 === 1);

      setIsLocked(true);
      setLockTimer(LOCK_TIME);

      setTimeout(fetchStatus, 3000);
    } catch (err) {
      console.error("Write Error:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto border">

      <h2 className="text-2xl font-bold text-center mb-8">
        ⚙ {t("smartControlPanel")}
      </h2>

      {isLocked && (
        <div className="flex justify-center items-center gap-2 mb-6 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
          <Timer size={18} />
          {t("pleaseWait")} {lockTimer}s...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-center">
            🔌 {t("motorControl")}
          </h3>

          <Control
            icon={<Power />}
            title={t("motorPump")}
            status={motorStatus}
            disabled={isLocked}
            onOn={() =>
              updateAllFields(
                1,
                fertilizerStatus ? 1 : 0,
                valve1Status ? 1 : 0,
                valve2Status ? 1 : 0
              )
            }
            onOff={() =>
              updateAllFields(
                0,
                fertilizerStatus ? 1 : 0,
                valve1Status ? 1 : 0,
                valve2Status ? 1 : 0
              )
            }
          />

          <Control
            icon={<Droplet />}
            title={t("fertilizer")}
            status={fertilizerStatus}
            disabled={isLocked}
            onOn={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                1,
                valve1Status ? 1 : 0,
                valve2Status ? 1 : 0
              )
            }
            onOff={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                0,
                valve1Status ? 1 : 0,
                valve2Status ? 1 : 0
              )
            }
          />
        </div>

        {/* RIGHT SIDE */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-center">
            🚰 {t("valveControl")}
          </h3>

          <Control
            icon={<Settings />}
            title={t("valve1")}
            status={valve1Status}
            disabled={isLocked}
            onOn={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                fertilizerStatus ? 1 : 0,
                1,
                valve2Status ? 1 : 0
              )
            }
            onOff={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                fertilizerStatus ? 1 : 0,
                0,
                valve2Status ? 1 : 0
              )
            }
          />

          <Control
            icon={<Settings />}
            title={t("valve2")}
            status={valve2Status}
            disabled={isLocked}
            onOn={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                fertilizerStatus ? 1 : 0,
                valve1Status ? 1 : 0,
                1
              )
            }
            onOff={() =>
              updateAllFields(
                motorStatus ? 1 : 0,
                fertilizerStatus ? 1 : 0,
                valve1Status ? 1 : 0,
                0
              )
            }
          />
        </div>

      </div>
    </div>
  );
};

/* ================= REUSABLE CONTROL ================= */
const Control = ({
  icon,
  title,
  status,
  onOn,
  onOff,
  disabled,
}: any) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-lg">{title}</span>
        </div>

        <span
          className={`font-bold text-lg ${
            status ? "text-green-600" : "text-red-500"
          }`}
        >
          {status ? t("on") : t("off")}
        </span>
      </div>

      <div className="flex gap-4">
        <button
          disabled={disabled}
          onClick={onOn}
          className={`flex-1 py-3 rounded-xl font-semibold ${
            status
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          {t("on")}
        </button>

        <button
          disabled={disabled}
          onClick={onOff}
          className={`flex-1 py-3 rounded-xl font-semibold ${
            !status
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          {t("off")}
        </button>
      </div>
    </div>
  );
};

export default Node3Control;
