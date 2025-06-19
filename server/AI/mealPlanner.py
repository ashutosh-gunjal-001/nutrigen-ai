from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-05-20")

def generate_meal_plan(name, age, gender, height, weight, diet_preference, goal, activity_level, allergies):
    prompt = f"""
You are a certified AI nutritionist.

Your task is to create a personalized 7-day meal plan (Sunday to Saturday) for a single person based on the following input:

- Name: {name}
- Age: {age}
- Gender: {gender}
- Height: {height} cm
- Weight: {weight} kg
- Diet Preference: {diet_preference}
- Goal: {goal}
- Activity Level: {activity_level}
- Allergies: {allergies}
- Calories: Calculate the ideal daily calorie intake using this logic: 
   - **Base Calories (BMR estimate)**:
     - Male: `10 × {weight} + 6.25 × {height} - 5 × {age} + 5`
     - Female: `10 × {weight} + 6.25 × {height} - 5 × {age} - 161`
   - **Activity Factor**:
     - Sedentary: ×1.2
     - Lightly Active: ×1.375
     - Moderately Active: ×1.55
     - Very Active: ×1.725
   - **Goal Adjustment**:
     - Weight Loss: subtract 500 kcal
     - Muscle Gain: add 500 kcal
     - Maintenance: no change

Each day must include 4 meals:
- Breakfast
- Lunch
- Dinner
- Snack

Each meal must contain:
- name: Name of the dish (string)
- ingredients: Comma-separated list of ingredients (string)
- portionSize: e.g., 1 bowl, 2 roti, 1 cup (string)
- calories: kcal (number)
- protein: grams (number)
- carbs: grams (number)
- fat: grams (number)

 RULES:
- All meals must be varied across the week — no repetition
- Meals must strictly follow diet preference and avoid allergic ingredients
- Caloric and macronutrient distribution must align with the user’s goal and activity level

 GOAL:
Return the result in pure JSON. No introductions, comments, markdown, or text outside the JSON.

 STRICT JSON STRUCTURE (required):
{{
  "mealPlan": {{
    "Sunday": {{
      "Breakfast": {{
        "name": "",
        "ingredients": "",
        "portionSize": "",
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      }},
      "Lunch": {{ ... }},
      "Dinner": {{ ... }},
      "Snack": {{ ... }}
    }},
    "Monday": {{ ... }},
    ...
    "Saturday": {{
      "Breakfast": {{ ... }},
      "Lunch": {{ ... }},
      "Dinner": {{ ... }},
      "Snack": {{ ... }}
    }}
  }}
}}

 DO NOT:
- Include markdown
- Include explanations
- Mention that you are an AI
- Deviate from the format

This JSON will be stored in a Firebase database and shown in a personal meal planning app. Ensure accuracy, clarity, and consistency in formatting.
"""

    messages = [SystemMessage(content="You are a nutrition assistant."), HumanMessage(content=prompt)]
    result = model.invoke(messages)
    response = result.content.strip()
    if response.startswith("```json"):
        response = response[len("```json"):].strip()
    if response.endswith("```"):
        response = response[:-len("```")].strip()
    return response