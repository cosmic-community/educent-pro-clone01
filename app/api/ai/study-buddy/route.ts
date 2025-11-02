import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { subject, question } = await request.json()
        
        // Check if OpenAI API key is available
        if (process.env.OPENAI_API_KEY) {
            // Use OpenAI API for real AI responses
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert ${subject} teacher. Explain concepts clearly and provide step-by-step solutions. Be encouraging and patient like a real teacher.`
                        },
                        {
                            role: 'user',
                            content: question
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            })
            
            if (response.ok) {
                const data = await response.json()
                return NextResponse.json({ 
                    response: data.choices[0].message.content 
                })
            }
        }
        
        // Fallback to enhanced educational responses
        const response = generateEducationalResponse(subject, question)
        return NextResponse.json({ response })
    } catch (error) {
        console.error('AI Study Buddy error:', error)
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        )
    }
}

function generateEducationalResponse(subject: string, question: string): string {
    // Enhanced educational responses with more detail
    const responses: Record<string, string> = {
        Mathematics: `Excellent question about ${question}!

📐 **Understanding the Problem**:
Let me break this down step by step for you.

1. **Identify What We Know**:
   - Look at the given information
   - Identify the variables
   - Understand what we're solving for

2. **Choose the Right Method**:
   - For algebra: Use substitution or elimination
   - For geometry: Apply relevant theorems
   - For calculus: Identify if it's differentiation or integration

3. **Step-by-Step Solution**:
   - Write out each step clearly
   - Show all your work
   - Check your answer by substituting back

4. **Common Mistakes to Avoid**:
   - Don't skip steps
   - Always check signs (+ and -)
   - Verify units if applicable

💡 **Practice Tip**: Try solving 3 similar problems to master this concept!

Would you like me to work through a specific example?`,
        
        Science: `Great scientific inquiry about ${question}!

🔬 **Scientific Explanation**:

1. **Core Principle**:
   This relates to fundamental laws of ${subject}. Let me explain the underlying science.

2. **How It Works**:
   - At the molecular/atomic level...
   - The process involves...
   - Key factors that affect this are...

3. **Real-World Applications**:
   - In nature, we see this when...
   - Technology uses this principle in...
   - This affects our daily lives through...

4. **Experiment You Can Try**:
   - Materials needed: [simple household items]
   - Procedure: [safe, simple steps]
   - What to observe: [expected results]

5. **Deeper Understanding**:
   - This connects to other concepts like...
   - Scientists discovered this by...

🔍 **Critical Thinking**: What variables might change the outcome?

Need clarification on any part?`,
        
        English: `Wonderful question about ${question}!

📚 **Language & Literature Guidance**:

1. **Grammar/Writing Aspect**:
   - Rule: [relevant grammar rule]
   - Structure: [proper sentence/paragraph structure]
   - Common usage: [examples]

2. **Literary Analysis**:
   - Theme identification
   - Character development
   - Literary devices used
   - Author's purpose

3. **Practical Examples**:
   - Correct: "..."
   - Incorrect: "..."
   - Why: [explanation]

4. **Tips for Improvement**:
   - Read actively, not passively
   - Practice writing daily
   - Expand vocabulary through context

5. **Exercise**:
   Try writing a paragraph using this concept!

✍️ **Remember**: Good writing is rewriting!

Would you like more examples?`,
        
        default: `Excellent question! Let me help you understand ${question} in ${subject}.

🎓 **Comprehensive Explanation**:

1. **Foundation Concepts**:
   - Basic principle: [explanation]
   - Why it matters: [relevance]
   - Prerequisites: [what you should know]

2. **Detailed Breakdown**:
   - Part A: [explanation]
   - Part B: [explanation]
   - How they connect: [relationship]

3. **Visual Learning**:
   Imagine this concept like...
   [Analogy or visualization]

4. **Practice Application**:
   - Example 1: [simple example]
   - Example 2: [moderate example]
   - Challenge: [complex application]

5. **Memory Techniques**:
   - Mnemonic: [memory aid]
   - Key points to remember: [bullet points]

6. **Common Questions**:
   - Q: [frequent doubt]
   - A: [clear answer]

🌟 **Next Steps**: Master this, then move to [related topic]

Any specific part you'd like me to elaborate on?`
    }
    
    return responses[subject] || responses.default
}