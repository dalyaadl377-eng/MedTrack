import { useMemo, useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  HeartPulse,
  Droplets,
  Weight,
  Lightbulb,
  CalendarDays,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { useHealth } from "../../context/HealthContext";

const Insights = () => {
  const { healthData } = useHealth();

  const [selectedPeriod, setSelectedPeriod] =
    useState("week");

  const [selectedMetric, setSelectedMetric] =
    useState("heartRate");

  const periodLabels = {
    week: "Last 7 Days",
    month: "This Month",
    year: "This Year",
  };

  /*
   * Mock historical trend data.
   * The latest value comes from HealthContext.
   */
  const chartData = useMemo(() => {
    const heartRate = Number(
      healthData.heartRate.value
    );

    const bloodSugar = Number(
      healthData.bloodSugar.value
    );

    const weight = Number(
      healthData.weight.value
    );

    if (selectedPeriod === "week") {
      return [
        {
          label: "Mon",
          heartRate: heartRate - 4,
          bloodSugar: bloodSugar + 5,
          weight: weight + 0.6,
        },
        {
          label: "Tue",
          heartRate: heartRate - 2,
          bloodSugar: bloodSugar + 2,
          weight: weight + 0.4,
        },
        {
          label: "Wed",
          heartRate: heartRate + 1,
          bloodSugar: bloodSugar + 4,
          weight: weight + 0.3,
        },
        {
          label: "Thu",
          heartRate: heartRate - 1,
          bloodSugar: bloodSugar - 1,
          weight: weight + 0.2,
        },
        {
          label: "Fri",
          heartRate: heartRate + 3,
          bloodSugar: bloodSugar - 3,
          weight: weight,
        },
        {
          label: "Sat",
          heartRate: heartRate + 1,
          bloodSugar: bloodSugar - 2,
          weight: weight - 0.1,
        },
        {
          label: "Sun",
          heartRate,
          bloodSugar,
          weight,
        },
      ];
    }

    if (selectedPeriod === "month") {
      return [
        {
          label: "Week 1",
          heartRate: heartRate - 5,
          bloodSugar: bloodSugar + 7,
          weight: weight + 1.1,
        },
        {
          label: "Week 2",
          heartRate: heartRate - 3,
          bloodSugar: bloodSugar + 4,
          weight: weight + 0.7,
        },
        {
          label: "Week 3",
          heartRate: heartRate - 1,
          bloodSugar: bloodSugar + 2,
          weight: weight + 0.3,
        },
        {
          label: "Week 4",
          heartRate,
          bloodSugar,
          weight,
        },
      ];
    }

    return [
      {
        label: "Jan",
        heartRate: heartRate - 6,
        bloodSugar: bloodSugar + 9,
        weight: weight + 2.1,
      },
      {
        label: "Feb",
        heartRate: heartRate - 5,
        bloodSugar: bloodSugar + 7,
        weight: weight + 1.7,
      },
      {
        label: "Mar",
        heartRate: heartRate - 4,
        bloodSugar: bloodSugar + 5,
        weight: weight + 1.3,
      },
      {
        label: "Apr",
        heartRate: heartRate - 2,
        bloodSugar: bloodSugar + 4,
        weight: weight + 0.8,
      },
      {
        label: "May",
        heartRate: heartRate - 1,
        bloodSugar: bloodSugar + 2,
        weight: weight + 0.4,
      },
      {
        label: "Jun",
        heartRate,
        bloodSugar,
        weight,
      },
    ];
  }, [healthData, selectedPeriod]);

  /*
   * Chart configuration
   */
  const metricConfig = {
    heartRate: {
      label: "Heart Rate",
      unit: "BPM",
      min: 50,
      max: 110,
    },

    bloodSugar: {
      label: "Blood Sugar",
      unit: "mg/dL",
      min: 50,
      max: 150,
    },

    weight: {
      label: "Weight",
      unit: "kg",
      min: Math.max(
        20,
        Number(healthData.weight.value) - 5
      ),
      max:
        Number(healthData.weight.value) + 5,
    },
  };

  const currentMetric =
    metricConfig[selectedMetric];

  /*
   * Trend Cards
   */
  const trendCards = [
    {
      id: 1,
      label: "Heart Rate",
      value: `${healthData.heartRate.value} ${healthData.heartRate.unit}`,
      change:
        healthData.heartRate.status ===
        "Normal"
          ? "Stable"
          : "Needs attention",
      trend:
        healthData.heartRate.status ===
        "Normal"
          ? "positive"
          : "negative",
      icon: HeartPulse,
    },

    {
      id: 2,
      label: "Blood Sugar",
      value: `${healthData.bloodSugar.value} ${healthData.bloodSugar.unit}`,
      change:
        healthData.bloodSugar.status ===
        "Normal"
          ? "Normal range"
          : "Needs attention",
      trend:
        healthData.bloodSugar.status ===
        "Normal"
          ? "positive"
          : "negative",
      icon: Droplets,
    },

    {
      id: 3,
      label: "Blood Pressure",
      value: `${healthData.bloodPressure.value} ${healthData.bloodPressure.unit}`,
      change:
        healthData.bloodPressure.status ===
        "Normal"
          ? "Normal"
          : "Needs attention",
      trend:
        healthData.bloodPressure.status ===
        "Normal"
          ? "positive"
          : "negative",
      icon: Activity,
    },

    {
      id: 4,
      label: "Weight",
      value: `${healthData.weight.value} ${healthData.weight.unit}`,
      change: healthData.weight.status,
      trend: "positive",
      icon: Weight,
    },
  ];

  /*
   * Dynamic Health Insights
   */
  const healthInsights = useMemo(() => {
    const insights = [];

    if (
      healthData.heartRate.status ===
      "Normal"
    ) {
      insights.push({
        title: "Stable Heart Rate",
        description:
          "Your current heart rate is within the normal resting range.",
        type: "success",
      });
    } else {
      insights.push({
        title:
          "Heart Rate Needs Attention",
        description:
          "Your current heart rate is outside the normal resting range. Consider monitoring it regularly.",
        type: "warning",
      });
    }

    if (
      healthData.bloodSugar.status ===
      "Normal"
    ) {
      insights.push({
        title: "Healthy Blood Sugar",
        description:
          "Your current blood sugar reading is within the expected range.",
        type: "success",
      });
    } else {
      insights.push({
        title:
          "Blood Sugar Needs Attention",
        description:
          "Your blood sugar reading is outside the reference range. Keep monitoring your readings.",
        type: "warning",
      });
    }

    if (
      healthData.bloodPressure.status ===
      "Normal"
    ) {
      insights.push({
        title:
          "Blood Pressure Looks Good",
        description:
          "Your latest blood pressure reading is in a healthy range.",
        type: "success",
      });
    } else {
      insights.push({
        title:
          "Monitor Blood Pressure",
        description:
          "Your latest blood pressure reading may need closer monitoring.",
        type: "warning",
      });
    }

    insights.push({
      title: "Keep Tracking Your Health",
      description:
        "Regularly updating your health measurements makes it easier to identify changes over time.",
      type: "info",
    });

    return insights;
  }, [healthData]);

  return (
    <div className="insights-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <span className="health-page-kicker">
            HEALTH ANALYTICS
          </span>

          <h1>
            Insights & Trends
          </h1>

          <p>
            Understand your health patterns
            and track changes over time.
          </p>
        </div>

        <div className="insights-period-control">

          <CalendarDays size={17} />

          <select
            value={selectedPeriod}
            onChange={(event) =>
              setSelectedPeriod(
                event.target.value
              )
            }
          >
            <option value="week">
              This Week
            </option>

            <option value="month">
              This Month
            </option>

            <option value="year">
              This Year
            </option>
          </select>

        </div>

      </div>

      {/* =====================================
          TREND CARDS
      ====================================== */}

      <section className="insights-trends">

        {trendCards.map((item) => {

          const Icon = item.icon;

          const isPositive =
            item.trend === "positive";

          return (
            <div
              className="insight-trend-card"
              key={item.id}
            >

              <div className="insight-card-top">

                <div className="insight-icon">
                  <Icon size={21} />
                </div>

                <span
                  className={`trend-change ${
                    isPositive
                      ? "trend-positive"
                      : "trend-negative"
                  }`}
                >

                  {isPositive ? (
                    <TrendingUp
                      size={14}
                    />
                  ) : (
                    <TrendingDown
                      size={14}
                    />
                  )}

                  {item.change}

                </span>

              </div>

              <span className="insight-label">
                {item.label}
              </span>

              <strong className="insight-value">
                {item.value}
              </strong>

              <span className="insight-period">
                Current measurement
              </span>

            </div>
          );
        })}

      </section>

      {/* =====================================
          LINE CHART
      ====================================== */}

      <section className="insights-chart-card">

        <div className="insights-section-header">

          <div>
            <h2>
              Trends Overview
            </h2>

            <p>
              Track your health measurements
              over time.
            </p>
          </div>

          <div className="chart-controls">

            <select
              className="chart-metric-select"
              value={selectedMetric}
              onChange={(event) =>
                setSelectedMetric(
                  event.target.value
                )
              }
            >
              <option value="heartRate">
                Heart Rate
              </option>

              <option value="bloodSugar">
                Blood Sugar
              </option>

              <option value="weight">
                Weight
              </option>
            </select>

          </div>

        </div>

        {chartData.length > 0 ? (
          <div className="line-chart">

            {/* Y Axis */}

            <div className="line-chart-y-axis">

              <span>
                {currentMetric.max}
              </span>

              <span>
                {Math.round(
                  (currentMetric.max +
                    currentMetric.min) /
                    2
                )}
              </span>

              <span>
                {currentMetric.min}
              </span>

            </div>

            {/* Chart */}

            <div className="line-chart-main">

              {/* Grid */}

              <div className="line-chart-grid">

                <span />
                <span />
                <span />
                <span />

              </div>

              {/* SVG */}

              <svg
                className="line-chart-svg"
                viewBox="0 0 700 260"
                preserveAspectRatio="none"
              >

                {/* Area */}

                <polygon
                  className="chart-area"
                  points={`
                    ${chartData
                      .map(
                        (
                          item,
                          index
                        ) => {

                          const x =
                            (index /
                              (chartData.length -
                                1)) *
                              680 +
                            10;

                          const value =
                            Number(
                              item[
                                selectedMetric
                              ]
                            );

                          const y =
                            230 -
                            ((value -
                              currentMetric.min) /
                              (currentMetric.max -
                                currentMetric.min)) *
                              200;

                          return `${x},${y}`;
                        }
                      )
                      .join(" ")}

                    690,230
                    10,230
                  `}
                />

                {/* Line */}

                <polyline
                  className="chart-line"
                  points={chartData
                    .map(
                      (
                        item,
                        index
                      ) => {

                        const x =
                          (index /
                            (chartData.length -
                              1)) *
                            680 +
                          10;

                        const value =
                          Number(
                            item[
                              selectedMetric
                            ]
                          );

                        const y =
                          230 -
                          ((value -
                            currentMetric.min) /
                            (currentMetric.max -
                              currentMetric.min)) *
                            200;

                        return `${x},${y}`;
                      }
                    )
                    .join(" ")}
                />

                {/* Points */}

                {chartData.map(
                  (
                    item,
                    index
                  ) => {

                    const x =
                      (index /
                        (chartData.length -
                          1)) *
                        680 +
                      10;

                    const value =
                      Number(
                        item[
                          selectedMetric
                        ]
                      );

                    const y =
                      230 -
                      ((value -
                        currentMetric.min) /
                        (currentMetric.max -
                          currentMetric.min)) *
                        200;

                    return (
                      <g
                        key={item.label}
                      >

                        {/* Glow */}

                        <circle
                          className="chart-point-glow"
                          cx={x}
                          cy={y}
                          r="7"
                        />

                        {/* Point */}

                        <circle
                          className="chart-point"
                          cx={x}
                          cy={y}
                          r="4"
                        />

                        {/* Value */}

                        <text
                          className="chart-value"
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                        >
                          {value}
                        </text>

                      </g>
                    );
                  }
                )}

              </svg>

              {/* X Axis */}

              <div className="line-chart-x-axis">

                {chartData.map(
                  (item) => (
                    <span
                      key={item.label}
                    >
                      {item.label}
                    </span>
                  )
                )}

              </div>

            </div>

          </div>
        ) : (
          <div className="insights-empty-state">

            <Activity size={28} />

            <h3>
              No trend data available
            </h3>

            <p>
              Update your health measurements
              to start tracking trends.
            </p>

          </div>
        )}

        {/* Chart Footer */}

        <div className="chart-footer">

          <span>
            {currentMetric.label}
          </span>

          <span>
            Unit: {currentMetric.unit}
          </span>

        </div>

      </section>

      {/* =====================================
          HEALTH INSIGHTS
      ====================================== */}

      <section className="health-insights-card">

        <div className="insights-section-header">

          <div>
            <h2>
              Health Insights
            </h2>

            <p>
              Personalized observations based
              on your current health data.
            </p>
          </div>

          <div className="insights-header-icon">
            <Lightbulb size={20} />
          </div>

        </div>

        <div className="health-insight-list">

          {healthInsights.map(
            (insight, index) => (

              <div
                className="health-insight-item"
                key={insight.title}
              >

                <div className="health-insight-number">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </div>

                <div className="health-insight-content">

                  <div className="health-insight-title">

                    {insight.type ===
                    "success" ? (
                      <CheckCircle
                        size={17}
                      />
                    ) : insight.type ===
                      "warning" ? (
                      <AlertCircle
                        size={17}
                      />
                    ) : (
                      <Lightbulb
                        size={17}
                      />
                    )}

                    <h3>
                      {insight.title}
                    </h3>

                  </div>

                  <p>
                    {insight.description}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    </div>
  );
};

export default Insights;