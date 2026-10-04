# Analytics Scope, Missingness & Statistical Traps

## Purpose

Analytics are measurements produced under defined scopes, filters, definitions, windows, and collection rules. A number without context can be misleading.

## Scope first

Before comparing values, record date and time window, channel or video scope, format, geography or audience filter, traffic source, metric definition, dimension, time zone where relevant, and whether the value is estimated or finalized.

## Missing data

A missing value is not necessarily zero. It may indicate insufficient sample size, unavailable reporting, changed definitions, privacy thresholds, delayed processing, or a dimension that does not apply. Never silently convert unknown into zero.

## Comparability

Metrics with similar names may have different definitions across reports or time periods. Platform reporting evolves, so check the current definition before combining historical datasets.

## Statistical traps

Watch for small-sample volatility, selection bias, survivorship bias, Simpson's paradox, correlation mistaken for causation, multiple comparisons, regression to the mean, confounding variables, and cherry-picked windows.

## Averages

Averages can conceal distribution differences. Compare segments when they have a meaningful interpretation and retain sample sizes where possible.

## Experiment interpretation

Define the observation window before looking at outcomes. Avoid declaring a winner because of a tiny short-term movement. Record uncertainty and plausible alternative explanations.

## Evidence hierarchy

Use direct platform measurements for platform behavior, controlled tests for causal questions where feasible, and qualitative evidence for motivations and failure modes. No single evidence type answers every question.

## Principle

Good analytics practice is disciplined interpretation. The objective is not to make data say something decisive; it is to make decisions that remain reasonable given what the data can and cannot establish.
