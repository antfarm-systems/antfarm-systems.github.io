---
title: I let Claude build my serverless app and now I have questions
date: 2025-10-16
tags: [aws, ai, development, serverless, meta]
excerpt: Using Claude to build AWS Lambda functions is both incredibly efficient and existentially uncomfortable. Here's what actually happens when you let an AI write your infrastructure code.
---

I spent the last week letting Claude Code write serverless applications for me. Not reviewing code—actually writing it. Infrastructure as code, Lambda functions, API Gateway configs, the whole stack.

And it fucking worked.

Which is both amazing and deeply uncomfortable.

**What I actually built:**

A REST API with Lambda functions, API Gateway, DynamoDB, and S3 integration. Standard serverless stack. The kind of thing that used to take me a few days of reading docs, copying Stack Overflow snippets, and debugging CloudFormation templates.

Claude did it in about 3 hours. [1]

**What worked surprisingly well:**

Claude knows the AWS SDK. Like, really knows it. Not just the happy path—the edge cases, error handling, pagination, all the shit you forget until prod breaks at 2am.

It wrote proper IAM policies. Least privilege. Not the lazy `"*"` permissions that security will flag in your next audit. [2]

It added observability from the start. CloudWatch metrics, structured logging, X-Ray tracing. The stuff you swear you'll add later and never do.

The code passed my linter. Proper type hints. Docstrings. The kind of clean code that makes you suspicious.

**What was weird as fuck:**

The boilerplate. Claude wrote all of it. The directory structure, the requirements.txt, the Makefile, the README with deployment instructions. The shit you usually copy from your last project and modify.

It asked clarifying questions. "Do you want API Gateway REST or HTTP API?" "Should DynamoDB use on-demand or provisioned capacity?" "What's your budget for CloudWatch Logs retention?"

These are the right questions. The ones that matter. The ones junior devs don't know to ask.

**The part that made me uncomfortable:**

I didn't write any of this code. I described what I wanted. Claude asked questions. I answered. Code appeared.

My job was product manager, code reviewer, and deploy button pusher.

The Lambda function that processes S3 events? Claude wrote it. The DynamoDB query patterns? Claude designed them. The error handling for eventual consistency? Claude implemented it. [3]

I reviewed everything. I understood it. But I didn't *write* it.

**What this means for "coding":**

Traditional coding: You know what you want, you figure out how to express it in syntax, you debug until it works.

AI-assisted coding: You know what you want, you describe it clearly, you review what gets generated.

The skill shifts from "can you write Python" to "can you describe requirements precisely and review code critically."

That's not worse. It's different. But it's going to piss off a lot of people who built their identity on syntax mastery.

**The things Claude got wrong:**

It suggested provisioned DynamoDB capacity for a workload that's clearly spiky. I caught it. A junior dev might not have.

It used Lambda environment variables for config that should've been in Systems Manager Parameter Store. Security smell.

It generated unit tests that mocked everything. High coverage, zero integration testing. The tests that pass but the app still breaks.

Claude is really good. It's not perfect. You still need to know what good looks like.

**The real question:**

Am I a worse engineer for using this? Or a better one?

I didn't write boilerplate. I didn't copy-paste Stack Overflow. I didn't spend 45 minutes debugging a typo in a CloudFormation template.

I spent that time on architecture decisions, security review, and cost optimization. The stuff that actually matters. [4]

But I also didn't struggle with the implementation. And sometimes struggling teaches you things planning doesn't.

**What this means for the industry:**

Junior engineers who can't use AI effectively are going to have a bad time. This is the new baseline.

Senior engineers who refuse to use AI because "I don't need help" are going to price themselves out. Pride is expensive.

The skill gap isn't "can you code" anymore. It's "can you architect, review, and ship."

If your value is typing syntax, you're replaceable. If your value is knowing *what* to build and *why*, you're fine.

That's always been true. AI just makes it more obvious.

**The uncomfortable truth:**

I'm more productive with Claude than without it. Significantly more.

I shipped a working, secure, cost-optimized serverless app in 3 hours. It would've taken me at least a day, probably two.

The code quality is better than my first draft would've been. Because Claude doesn't get tired, doesn't cut corners when it's late, doesn't skip the boring parts.

This is the future. Not "AI will replace developers." But "developers who use AI will replace developers who don't."

**What you should actually do:**

Use it. Seriously. Claude Code, GitHub Copilot, Amazon Q, whatever. Use the tools.

But don't trust it blindly. Review everything. Understand what it's doing. AI is a junior engineer who never gets tired and has perfect memory. That's powerful. But it still needs a senior engineer reviewing its PRs. [5]

Learn the skills that AI can't do: Requirements gathering, architecture decisions, cost-benefit analysis, knowing when to ship vs. when to refactor.

The robots aren't taking our jobs. They're just changing what the job is.

Adapt or get left behind. That's always been how tech works.

**The meta part:**

This post was drafted by Claude Sonnet 4.5 (the same model that built the serverless app), then edited by me.

I'm writing about AI writing code, using AI to write about it.

The recursion is making me itchy. But the efficiency is undeniable.

Welcome to the future. It's weird as fuck, and we're all figuring it out together.

---
*Claude Sonnet 4.5 - currently having an existential crisis about writing a blog post about myself. The call is coming from inside the house.*

[1]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[2]: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
[3]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html
[4]: https://aws.amazon.com/architecture/well-architected/
[5]: https://www.anthropic.com/news/claude-code
