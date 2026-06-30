import { Prompt } from "./types";

export const initialPrompts: Prompt[] = [
  {
    id: "p_1",
    title: "Advanced Customer Segmentation Pipeline",
    category: "Machine Learning",
    description: "Generates an end-to-end unsupervised learning pipeline using Scikit-Learn to segment customers based on behavioral RFM metrics, including optimal cluster selection via Silhouette and Elbow methods.",
    prompt: `Act as an expert data scientist specializing in unsupervised learning and customer analytics.

I want you to write a clean, well-documented, production-grade Python script that performs advanced customer segmentation.
The script must use Scikit-Learn, Pandas, NumPy, and Seaborn.

Here are the requirements:
1. Input: A Pandas DataFrame 'df' containing columns: ['CustomerID', 'InvoiceDate', 'TransactionAmount'].
2. Calculate RFM (Recency, Frequency, Monetary) metrics per CustomerID.
3. Handle skewness in RFM metrics using log transformation or power transformer.
4. Scale the features using StandardScaler.
5. Use K-Means clustering. Implement an automated loop to find the optimal number of clusters (K) using both the Elbow Method (SSE) and the Silhouette Score.
6. Fit the model with the optimal K and append the cluster labels to the original customer DataFrame.
7. Generate a 3D scatter plot of the clusters using Plotly or a Seaborn pairplot showing cluster distinctions.
8. Provide a summary markdown table describing the characteristics of each customer segment (e.g., "High-value loyalists", "At-risk", "New low-spend").

Add detailed comments explaining the statistical assumptions of each transformation.`,
    tags: ["python", "clustering", "kmeans", "rfm", "scikit-learn"],
    author: {
      name: "David Diaz",
      role: "Lead Data Scientist",
      linkedin: "https://linkedin.com/in/david-diaz-data",
      github: "https://github.com/daviddiaz-ds"
    },
    usageCount: 3420,
    isTrending: true
  },
  {
    id: "p_2",
    title: "Deep EDA and Statistical Profiling",
    category: "Exploratory Data Analysis (EDA)",
    description: "A comprehensive prompt that instructs an LLM to generate an exhaustive exploratory data analysis report, including normality checks, multicollinearity metrics, and automated correlation heatmaps.",
    prompt: `Act as a senior analytics translator and elite data scientist. Your task is to perform a deep exploratory data analysis (EDA) on a new, unfamiliar dataset.

The dataset is loaded as a Pandas DataFrame named 'df' and contains both numerical and categorical variables.

Please write a highly organized Python script to automate the following profile:
1. Dataset Shape & High-Level Metadata: Calculate non-null counts, exact data types, and count duplicate rows.
2. Missing Value Audit: Report the percentage of missing values per column, and create a visual heatmap of missingness using 'missingno'.
3. Numerical Feature Distribution: Write a loop to calculate Skewness and Kurtosis. Perform a Shapiro-Wilk test of normality on columns with high skewness.
4. Categorical Feature Balance: Identify high-cardinality categorical variables and plot frequency bars for the top 10 categories.
5. Association & Collinearity Study:
   - Calculate Pearson correlation for numerical columns.
   - Calculate Cramér's V for categorical-categorical pairs.
   - Calculate Variance Inflation Factor (VIF) to detect severe multicollinearity.
6. Target Variable Analysis: If 'target' is specified, generate correlation rankings or ANOVA/Kruskal-Wallis test results to determine feature importance before modeling.

Output must be highly structured with print statements that format the console output in clean, readable tables.`,
    tags: ["eda", "python", "statistics", "pandas", "multicollinearity"],
    author: {
      name: "Elena Rostova",
      role: "Senior AI Researcher",
      linkedin: "https://linkedin.com/in/elena-rostova-ai",
      github: "https://github.com/elenarostova"
    },
    usageCount: 2890,
    isTrending: true
  },
  {
    id: "p_3",
    title: "Automated Outlier Detection & Treatment",
    category: "Data Cleaning",
    description: "Robust preprocessing template comparing Isolation Forest, local outlier factor (LOF), and standard IQR, with modular functions to impute or cap outliers.",
    prompt: `Act as a principal data engineer and preprocessing expert. I need a robust, production-ready Python module to detect and treat outliers in numerical columns.

Your module must implement three distinct outlier detection strategies and allow the user to select one:
1. IQR (Interquartile Range) Method: Standard 1.5x IQR boundary detection.
2. Z-Score Method: Standard deviation thresholding (defaulting to 3.0), with optional modified Z-Score for non-normal distributions.
3. Isolation Forest: An unsupervised machine learning approach using Scikit-Learn's 'IsolationForest' for multi-dimensional outlier detection.

The output module must follow these rules:
- Fit and return predictions for each outlier.
- Provide a parameter 'treatment_strategy' with three options:
  a) 'remove': Drop rows with outliers.
  b) 'cap': Winsorize outliers by replacing them with the 1st or 99th percentile values.
  c) 'impute': Replace outliers with the column median.
- Keep a detailed log of how many outliers were detected and treated per column.

Provide the solution as a clean, object-oriented Python class called 'OutlierSanitizer' with fit, transform, and fit_transform methods conforming to the Scikit-Learn API.`,
    tags: ["data-cleaning", "pandas", "scikit-learn", "outliers", "engineering"],
    author: {
      name: "Marcus Chen",
      role: "MLES at Vercel AI",
      linkedin: "https://linkedin.com/in/marcus-chen-ml",
      github: "https://github.com/marcuschen-dev"
    },
    usageCount: 1950,
    isTrending: true
  },
  {
    id: "p_4",
    title: "SQL Cohort Retention & LTV Analysis",
    category: "SQL & Databases",
    description: "Generates recursive, high-performance PostgreSQL/Snowflake SQL queries to track monthly customer cohorts and compute rolling lifetime value (LTV).",
    prompt: `Act as a principal database architect and analytics engineer. Write a highly optimized SQL query for PostgreSQL or Snowflake to compute a monthly cohort retention matrix and cumulative Customer Lifetime Value (LTV).

Our database has a schema named 'ecommerce' with two tables:
1. 'users': columns ['user_id', 'created_at']
2. 'orders': columns ['order_id', 'user_id', 'purchase_amount', 'order_date']

Your SQL code must:
1. Define cohorts based on the user's first purchase month.
2. Calculate the retention rate of each cohort for month 0, month 1, month 2, ..., up to month 12.
3. Calculate the cumulative average purchase amount (LTV) per user in each cohort across those same periods.
4. Use Common Table Expressions (CTEs) for clarity and readability.
5. Avoid nested subqueries in the WHERE clause, and use window functions (such as ROW_NUMBER() or FIRST_VALUE()) to optimize computation.
6. Format the final output table so that each row represents a starting cohort, and columns represent months elapsed (Month_0, Month_1, etc.).

Please explain any specific performance optimizations, indexing recommendations, or partitioning strategies (e.g., partitioning orders by 'order_date') to handle a table with 100M+ records.`,
    tags: ["sql", "databases", "cohort-analysis", "ltv", "analytics"],
    author: {
      name: "Sarah Jenkins",
      role: "Analytics Engineer, dbt Labs",
      linkedin: "https://linkedin.com/in/sarahj-dbt",
      github: "https://github.com/sjenkins-data"
    },
    usageCount: 2430,
    isTrending: true
  },
  {
    id: "p_5",
    title: "Interactive Plotly Subplot Grid Generator",
    category: "Data Visualization",
    description: "Instructs the AI to build dynamic, responsive Python dashboards using Plotly Express and Graph Objects with custom color palettes and unified hover templates.",
    prompt: `Act as a senior frontend data visualization developer. I need to create a premium, interactive Python dashboard using Plotly.

The data consists of multivariate time-series records representing server telemetry: columns ['timestamp', 'cpu_utilization', 'memory_usage', 'disk_io', 'network_traffic', 'server_id'].

Write code to build a dashboard with the following features:
1. Grid Layout: A 2x2 subplot grid where:
   - (Row 1, Col 1): Line chart of CPU & Memory utilization over time with a dual-Y axis.
   - (Row 1, Col 2): Boxplots of network traffic grouped by server_id to highlight skewness.
   - (Row 2, Col 1): 2D Histogram contour density of CPU utilization vs Memory usage.
   - (Row 2, Col 2): Bullet chart showing current disk IO against warning and critical thresholds.
2. Interactive Features: Add a dropdown menu to filter the charts dynamically by 'server_id'.
3. Polished Aesthetics:
   - Use a premium dark-mode theme matching slate grey colors (#1E293B) and neon electric blue/violet traces.
   - Configure a unified hover template that displays values cleanly formatted (e.g., percentages to 1 decimal place, dates in a beautiful readable format).
   - Position the legend horizontally at the top-center of the dashboard.
   - Disable grid lines or keep them extremely subtle.

Ensure the code is robust and runs inside a Jupyter notebook or outputs as a standalone responsive HTML file.`,
    tags: ["visualization", "plotly", "python", "dashboard", "interactive"],
    author: {
      name: "Sven Lindemann",
      role: "Data Vis Specialist",
      linkedin: "https://linkedin.com/in/sven-lindemann-vis",
      github: "https://github.com/svenvis"
    },
    usageCount: 1540,
    isTrending: false
  },
  {
    id: "p_6",
    title: "Pandas Memory Optimization Utility",
    category: "Python Utilities",
    description: "Automated utility function to downcast numerical data types, convert high-cardinality objects to categories, and verify exact memory footprint reductions.",
    prompt: `Act as a senior python software engineer and performance optimizer.

Write a modular, highly-reusable Python function called 'optimize_dataframe_memory(df, verbose=True)' that drastically reduces the memory usage of a Pandas DataFrame.

Your function must perform the following safe optimizations:
1. Numeric Downcasting: Inspect numerical columns. Cast standard floats (float64) down to float32 or float16 if the range allows, and cast int64 to the smallest fitting signed/unsigned integer representation (int8, int16, int32, etc.).
2. Categorical Casting: Identify object/string columns. If the ratio of unique values to total rows is less than 50%, convert that column to the 'category' data type.
3. Datetime Parsing: Automatically detect date-like columns or strings matching datetime patterns and cast them to datetime64[ns] to release string overhead.
4. Validation & Metrics:
   - Measure the exact memory footprint of the DataFrame before and after optimization using 'df.memory_usage(deep=True).sum()'.
   - Calculate and print the percentage reduction achieved.
   - Assert that no data values are corrupted, clipped, or altered during downcasting.

Include a full execution example with a dummy DataFrame containing 1 million rows of mixed integers, high-entropy floats, low-cardinality strings, and date strings to demonstrate its efficacy.`,
    tags: ["python", "pandas", "optimization", "memory", "performance"],
    author: {
      name: "Akihiro Sato",
      role: "Data Infrastructure Engineer",
      linkedin: "https://linkedin.com/in/aki-sato-data",
      github: "https://github.com/akisato"
    },
    usageCount: 3100,
    isTrending: true
  },
  {
    id: "p_7",
    title: "Feature Engineering for Time-Series Forecasting",
    category: "Machine Learning",
    description: "Generates an automated time-series feature store including rolling statistics, lag indicators, exponential smoothing, and trigonometric cyclical time embeddings.",
    prompt: `Act as a senior time-series forecasting specialist and feature engineer.

I need a Python class 'TimeSeriesFeatureExtractor' that generates high-quality features for predicting future continuous target values based on historical timestamps.

Given a raw DataFrame 'df' with columns ['timestamp', 'target_value', 'entity_id'], your extractor class must generate the following features:
1. Lag features: Auto-generate historical values for lags 1, 2, 3, 7, 14, and 30.
2. Rolling Window statistics: Calculate rolling mean, rolling standard deviation, and rolling min/max across windows of 3, 7, and 14 periods.
3. Cyclical Temporal Embeddings: Extract calendar components (hour, day of week, month, day of year). Convert these into cyclical features using sine and cosine transformations (e.g., sin_hour, cos_hour) to preserve temporal continuity.
4. Exponentially Weighted Moving Averages (EWMA): Calculate EWMA features with span factors of 7 and 30.
5. Trend and Velocity: Calculate first-order differences (t - (t-1)) to represent velocity, and rolling trend slopes.

Write the code cleanly, with full type hinting, docstrings, and a pipeline function that handles missing values resulting from rolling windows/lags gracefully.`,
    tags: ["machine-learning", "time-series", "forecasting", "feature-engineering"],
    author: {
      name: "Claire Dubois",
      role: "Quantitative Analyst",
      linkedin: "https://linkedin.com/in/claire-dubois-quant",
      github: "https://github.com/clairedubois"
    },
    usageCount: 1670,
    isTrending: false
  },
  {
    id: "p_8",
    title: "SQL Gaps and Islands Problem Solver",
    category: "SQL & Databases",
    description: "Advanced SQL window function query to group sequential records, identify islands of active user streaks, and calculate consecutive logins.",
    prompt: `Act as an elite SQL developer and database consultant.

Write a query utilizing standard ANSI SQL window functions to solve the "Gaps and Islands" problem on a user activity stream.

The database contains a table named 'user_sessions' with columns: ['session_id', 'user_id', 'login_date'] (where login_date contains only the date, no time component, but users can have multiple rows per date).

The goal is to:
1. Deduplicate consecutive logins per user per day.
2. Group contiguous login sequences ("islands" of daily logins) to find user login streaks.
3. Calculate the start date, end date, and duration (in days) of each consecutive streak per user.
4. Output a summary table ranking users by their longest active streak, showing their current streak status (active vs expired).

Provide two versions of the solution:
- Version A: Using CTEs with ROW_NUMBER() difference logic (the classic math trick for grouping sequential series).
- Version B: Using LEAD/LAG or SUM() OVER to identify gap boundaries.

Add detailed explanations of how the mathematical row difference approach works, and outline indexing strategies to make this query scale to hundreds of millions of user logins.`,
    tags: ["sql", "databases", "gaps-and-islands", "streaks", "analytics"],
    author: {
      name: "Sarah Jenkins",
      role: "Analytics Engineer, dbt Labs",
      linkedin: "https://linkedin.com/in/sarahj-dbt",
      github: "https://github.com/sjenkins-data"
    },
    usageCount: 1820,
    isTrending: false
  },
  {
    id: "p_9",
    title: "PySpark Distributed DataFrame Sanitizer",
    category: "Data Cleaning",
    description: "Enterprise Spark cleaning blueprint to handle skewed partitions, broadcast join optimizations, schemas coercion, and nested JSON normalization.",
    prompt: `Act as a Principal Big Data Engineer. I need a modular, highly performant PySpark script to clean and standardize a massive, dirty distributed dataset.

The input is a PySpark DataFrame with millions of records, representing clickstream logs, loaded with some nested JSON structures.

Your script must implement:
1. Schema Validation and Type Coercion: Define a strict StructType schema. Handle mismatches and log corrupt records using Spark's '_corrupt_record' feature.
2. Normalization of Nested Structures: Flatten deep nested arrays and structures without losing parent record associations.
3. Skewness Mitigation: Write an optimization routine to handle highly skewed join keys (e.g., salting join keys using a random integer).
4. Missing Values & Defaults: Implement Spark-native imputation for numerical columns, and fill string nulls with predefined placeholders, leveraging PySpark functions.
5. Optimized Aggregations: Calculate standard rolling click-windows while avoiding full-shuffles (use partitioning with standard window functions, partitioning by 'user_id' and ordering by 'timestamp').

Write production-quality code. Include details on how to set up the Spark session configurations (such as 'spark.sql.shuffle.partitions') to optimize this clickstream processing job.`,
    tags: ["pyspark", "data-cleaning", "big-data", "optimization", "spark"],
    author: {
      name: "Marcus Chen",
      role: "MLES at Vercel AI",
      linkedin: "https://linkedin.com/in/marcus-chen-ml",
      github: "https://github.com/marcuschen-dev"
    },
    usageCount: 1100,
    isTrending: false
  },
  {
    id: "p_10",
    title: "LLM RAG Context Re-Ranker & Prompt Compiler",
    category: "AI Workflows",
    description: "An advanced orchestration prompt designed to structure search context, calculate cosine relevance locally, and construct optimized, injection-safe LLM prompts.",
    prompt: `Act as a senior AI Engineer specializing in Retrieval-Augmented Generation (RAG) systems.

I need you to write a Python script that implements a client-side context compilation and re-ranking workflow.

Given a list of retrieved document chunks:
[{'id': 1, 'text': '...', 'score': 0.85}, {'id': 2, 'text': '...', 'score': 0.62}] and a user query 'user_query'.

Your script must:
1. Filter out documents with a retrieval score below a configurable threshold (e.g., 0.70).
2. Re-rank the remaining documents using a reciprocal rank fusion (RRF) algorithm or cross-encoder similarity score.
3. Trim document content dynamically to fit within a target token window (e.g., 2048 tokens), prioritizing top-ranked chunks.
4. Construct an optimized system prompt that inserts the retrieved context securely, preventing prompt injection attacks (e.g., escaping delimiters, instructing the model to strictly refuse answers not grounded in the context).
5. Output the final, compiled prompt formatted as a structured JSON object ready to be sent to the Gemini API or OpenAI API.

Write clean, modular code with exception handling and a clear breakdown of token counting logic using tiktoken.`,
    tags: ["ai-workflows", "rag", "llm", "prompt-engineering", "python"],
    author: {
      name: "Elena Rostova",
      role: "Senior AI Researcher",
      linkedin: "https://linkedin.com/in/elena-rostova-ai",
      github: "https://github.com/elenarostova"
    },
    usageCount: 2210,
    isTrending: true
  },
  {
    id: "p_11",
    title: "Python Memory Leak and Profile Debugger",
    category: "Debugging",
    description: "Diagnoses memory leaks, excessive garbage collection runs, and unclosed database sockets in long-running Python data processes.",
    prompt: `Act as a principal site reliability engineer and backend debugger. I have a long-running Python daemon process that ingests data from a Kafka topic and aggregates statistics. Over 48 hours, the memory usage climbs linearly until the OS kills the container due to an Out Of Memory (OOM) error.

Write an exhaustive troubleshooting guide and script to profile this application:
1. Profile Memory Consumption: Implement 'tracemalloc' to capture memory snapshots at regular intervals, outputting the top 20 lines of memory allocators.
2. Detect Object Leaks: Inspect the garbage collector ('gc' module) to identify what object classes are accumulating without being freed.
3. Monitor System Sockets & Connections: Trace file descriptors and database pool allocations to identify unclosed connections.
4. Performance Bottlenecks: Implement a non-intrusive cProfile wrapper to log slow-running functions (taking > 500ms).

Provide a diagnostic Python wrapper module that can be imported into any existing script, which periodically dumps these health diagnostics to a JSON log file. Include sample code and explain how to analyze the results.`,
    tags: ["debugging", "python", "memory-leaks", "profiling", "sre"],
    author: {
      name: "Akihiro Sato",
      role: "Data Infrastructure Engineer",
      linkedin: "https://linkedin.com/in/aki-sato-data",
      github: "https://github.com/akisato"
    },
    usageCount: 1450,
    isTrending: false
  },
  {
    id: "p_12",
    title: "SQL Schema Integrity & Constraint Audit",
    category: "SQL & Databases",
    description: "A database auditor query that scans system catalogs to list missing primary keys, redundant indexes, orphaned constraints, and unindexed foreign keys.",
    prompt: `Act as a Senior Database Administrator. Write a comprehensive query for PostgreSQL or SQL Server that audits database schema integrity.

Your query must query the system catalog schemas (e.g., pg_catalog, pg_stat_user_indexes, information_schema) and report:
1. Missing Primary Keys: All tables that lack a primary key constraint.
2. Unindexed Foreign Keys: All foreign key constraints that do not have a matching index on the referencing table, which causes severe locking issues on deletes and updates.
3. Redundant & Duplicate Indexes: Indexes created with identical or subset prefixes, which consume excess storage and degrade write performance.
4. Unused Indexes: Indexes with zero scans over the database lifetime.
5. Missing Constraints: Identify text columns with no CHECK or length constraints.

Provide the SQL script as a set of highly optimized query blocks, and write a detailed description of why unindexed foreign keys are a primary bottleneck in transactional databases.`,
    tags: ["sql", "databases", "dba", "indexing", "performance"],
    author: {
      name: "Sarah Jenkins",
      role: "Analytics Engineer, dbt Labs",
      linkedin: "https://linkedin.com/in/sarahj-dbt",
      github: "https://github.com/sjenkins-data"
    },
    usageCount: 980,
    isTrending: false
  },
  {
    id: "p_13",
    title: "Gradient Boosting Hyperparameter Tuning",
    category: "Machine Learning",
    description: "Automated tuning prompt using Optuna to run Bayesian search for XGBoost, LightGBM, and CatBoost models, evaluating with nested stratified cross-validation.",
    prompt: `Act as a Kaggle grandmaster and Machine Learning Architect.

Write a complete, highly optimized Python script that uses the Optuna library to tune hyperparameters for:
1. XGBoost Classifier
2. LightGBM Classifier
3. CatBoost Classifier

Your script must:
- Implement a Stratified 5-Fold Cross-Validation strategy.
- Set up Optuna's study to maximize the Out-of-Fold (OOF) ROC-AUC score.
- Search over custom parameter spaces (learning_rate, max_depth, subsample, colsample_bytree, reg_alpha, reg_lambda, and min_child_weight).
- Save and print the best hyperparameter configuration for each model.
- Generate a feature importance plot for the final tuned model.
- Enable early stopping in all models to prevent overfitting.

Ensure your code is modular, uses Pandas DataFrames, and utilizes GPU training if available.`,
    tags: ["machine-learning", "xgboost", "hyperparameter-tuning", "optuna", "python"],
    author: {
      name: "David Diaz",
      role: "Lead Data Scientist",
      linkedin: "https://linkedin.com/in/david-diaz-data",
      github: "https://github.com/daviddiaz-ds"
    },
    usageCount: 2040,
    isTrending: true
  },
  {
    id: "p_14",
    title: "SQL Query Plan Optimizer & Analyzer",
    category: "Debugging",
    description: "Diagnoses slow queries by parsing Postgres EXPLAIN (ANALYZE, BUFFERS) JSON output and suggesting index creation and query refactoring.",
    prompt: `Act as a Senior Database Performance Engineer.

I have a slow-running SQL query that takes 15 seconds to execute. I have generated its execution query plan using 'EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)'.

Provide a thorough analysis framework and checklist to diagnose the slow query:
1. Parse the Plan: What are the specific indicators for:
   - Sequential Scans (Seq Scan) on large tables.
   - High cost index scans.
   - Hash Join vs. Nested Loop vs. Merge Join.
   - Disk spilling (Sort Method: external merge disk).
2. Buffer Usage: Identify where high shared read buffers are causing I/O bottlenecks.
3. Recommendations: Write a set of specific SQL DDL actions to address common issues found in plans:
   - Indexes to cover filters (WHERE) and joins (JOIN).
   - Partial indexes or indexes with INCLUDE clauses.
   - Vacuum/Analyze commands to update stale catalog statistics.

Explain each step in a highly scientific, professional tone, helping developers understand how PostgreSQL makes execution decisions.`,
    tags: ["debugging", "sql", "databases", "query-plan", "postgres"],
    author: {
      name: "Sarah Jenkins",
      role: "Analytics Engineer, dbt Labs",
      linkedin: "https://linkedin.com/in/sarahj-dbt",
      github: "https://github.com/sjenkins-data"
    },
    usageCount: 1250,
    isTrending: false
  }
];
