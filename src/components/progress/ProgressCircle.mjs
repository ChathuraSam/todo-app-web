const ProgressCircle = ({
  size = 60,
  strokeWidth = 6,
  color = "#4caf50",
  bgColor = "#e0e0e0",
  spinning = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      style={{
        animation: spinning ? "spin 1s linear infinite" : "none",
        display: "block",
        margin: "auto",
        padding: strokeWidth / 2,
      }}
    >
      <circle
        stroke={bgColor}
        fill="none"
        strokeWidth={strokeWidth}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        stroke={color}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.25}
        style={{
          transition: "stroke-dashoffset 0.35s",
        }}
      />
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
};

export default ProgressCircle;
