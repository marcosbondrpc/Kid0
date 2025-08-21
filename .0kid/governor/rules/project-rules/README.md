# Project-Level Rule Overrides

This directory contains project-specific rules that override or extend the master rules for this particular project instance.

## Purpose

Project rules allow for customization of the Kid methodology to fit specific project needs while maintaining compatibility with the overall framework.

## Structure

- Rule files should follow the pattern: `project-rule-<category>-<description>.md`
- Each rule should specify which master rule(s) it overrides or extends
- Include rationale for project-specific deviations

## Usage

Rules in this directory are automatically loaded by the orchestration system during the pre_spec and pre_implement gates as configured in [`orchestration.yaml`](../../orchestration.yaml).