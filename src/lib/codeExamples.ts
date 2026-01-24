export interface CodeExample {
  id: string;
  classLevel: number;
  level: "beginner" | "intermediate" | "advanced";
  language: "python" | "javascript" | "c" | "cpp" | "java";
  title: string;
  description: string;
  code: string;
  expectedOutput?: string;
  hints?: string[];
  challenge?: string;
}

// Class 3 Examples (Ages 8-9) - Focus on Python basics
const class3Examples: CodeExample[] = [
  {
    id: "c3-1",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Hello World",
    description: "Your first program! Say hello to coding.",
    code: `# My First Program!
print("Hello, World!")
print("I am learning to code!")`,
    expectedOutput: "Hello, World!\nI am learning to code!",
    challenge: "Change the message to say your name!",
  },
  {
    id: "c3-2",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Counting Numbers",
    description: "Let's count from 1 to 5!",
    code: `# Counting Numbers
print("Let's count!")
print(1)
print(2)
print(3)
print(4)
print(5)
print("Done counting!")`,
    expectedOutput: "Let's count!\n1\n2\n3\n4\n5\nDone counting!",
    challenge: "Can you count to 10?",
  },
  {
    id: "c3-3",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "My Favorite Things",
    description: "Print your favorite things!",
    code: `# My Favorite Things
print("My favorite color is blue")
print("My favorite animal is dog")
print("My favorite food is pizza")`,
    challenge: "Change it to YOUR favorite things!",
  },
  {
    id: "c3-4",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Simple Math",
    description: "Let the computer do math for you!",
    code: `# Simple Math
print("2 + 3 =", 2 + 3)
print("5 - 2 =", 5 - 2)
print("4 x 2 =", 4 * 2)`,
    expectedOutput: "2 + 3 = 5\n5 - 2 = 3\n4 x 2 = 8",
    challenge: "Try bigger numbers!",
  },
  {
    id: "c3-5",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Star Border",
    description: "Make a pretty star border!",
    code: `# Star Border
print("* * * * * * * *")
print("*  WELCOME!   *")
print("* * * * * * * *")`,
    challenge: "Make the border with different symbols!",
  },
  {
    id: "c3-6",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Emoji Story",
    description: "Tell a story with words!",
    code: `# My Story
print("Once upon a time...")
print("There was a happy cat")
print("The cat found a fish")
print("The cat was very happy!")
print("THE END")`,
    challenge: "Write your own short story!",
  },
  {
    id: "c3-7",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Using Variables",
    description: "Store information in variables!",
    code: `# Variables are like boxes
name = "Alex"
age = 8
print("Hello, my name is", name)
print("I am", age, "years old")`,
    hints: ["Variables store information", "You can change the values"],
    challenge: "Change the name and age to yours!",
  },
  {
    id: "c3-8",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Counting with Loops",
    description: "Let the computer count for you!",
    code: `# Counting Loop
for i in range(1, 6):
    print(i)
print("Blast off!")`,
    expectedOutput: "1\n2\n3\n4\n5\nBlast off!",
    hints: ["range(1, 6) counts 1,2,3,4,5"],
    challenge: "Make it count to 10!",
  },
  {
    id: "c3-9",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Repeat Words",
    description: "Print the same thing multiple times!",
    code: `# Repeat
for i in range(3):
    print("Hip Hip Hooray!")`,
    challenge: "Make it say something else 5 times!",
  },
  {
    id: "c3-10",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Simple Pattern",
    description: "Make a simple pattern!",
    code: `# Simple Pattern
print("*")
print("**")
print("***")
print("****")
print("*****")`,
    challenge: "Make an upside down pattern!",
  },
  {
    id: "c3-11",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Even or Odd",
    description: "Check if a number is even or odd!",
    code: `# Even or Odd
number = 7
if number % 2 == 0:
    print(number, "is even")
else:
    print(number, "is odd")`,
    hints: ["% gives the remainder", "Even numbers have 0 remainder when divided by 2"],
    challenge: "Try different numbers!",
  },
  {
    id: "c3-12",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Bigger or Smaller",
    description: "Compare two numbers!",
    code: `# Compare Numbers
a = 10
b = 5
if a > b:
    print(a, "is bigger than", b)
else:
    print(b, "is bigger than", a)`,
    challenge: "What happens if both numbers are equal?",
  },
  {
    id: "c3-13",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Sum Calculator",
    description: "Add numbers together!",
    code: `# Sum Calculator
total = 0
for i in range(1, 6):
    total = total + i
    print("Adding", i, "Total:", total)
print("Final sum:", total)`,
    challenge: "Calculate sum of 1 to 10!",
  },
  {
    id: "c3-14",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "My Pet",
    description: "Describe your pet!",
    code: `# My Pet
pet_name = "Buddy"
pet_type = "dog"
print("I have a", pet_type)
print("Its name is", pet_name)
print(pet_name, "is my best friend!")`,
    challenge: "Change it to your pet!",
  },
  {
    id: "c3-15",
    classLevel: 3,
    level: "beginner",
    language: "python",
    title: "Days of Week",
    description: "Print all days of the week!",
    code: `# Days of the Week
print("Monday")
print("Tuesday")
print("Wednesday")
print("Thursday")
print("Friday")
print("Saturday")
print("Sunday")`,
    challenge: "Add what you do on each day!",
  },
  {
    id: "c3-16",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Multiplication Table",
    description: "Print a simple times table!",
    code: `# Times Table for 2
number = 2
for i in range(1, 6):
    print(number, "x", i, "=", number * i)`,
    challenge: "Try the 5 times table!",
  },
  {
    id: "c3-17",
    classLevel: 3,
    level: "intermediate",
    language: "python",
    title: "Countdown",
    description: "Countdown like a rocket launch!",
    code: `# Rocket Countdown
for i in range(10, 0, -1):
    print(i)
print("BLAST OFF!")`,
    expectedOutput: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nBLAST OFF!",
    challenge: "Start from 20!",
  },
  {
    id: "c3-18",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Password Check",
    description: "Check if password is correct!",
    code: `# Simple Password
password = "hello123"
guess = "hello123"
if guess == password:
    print("Access granted!")
else:
    print("Wrong password!")`,
    challenge: "Change the password!",
  },
  {
    id: "c3-19",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Grade Checker",
    description: "Check your grade!",
    code: `# Grade Checker
marks = 85
if marks >= 90:
    print("Grade: A")
elif marks >= 80:
    print("Grade: B")
elif marks >= 70:
    print("Grade: C")
else:
    print("Grade: D")`,
    challenge: "Try different marks!",
  },
  {
    id: "c3-20",
    classLevel: 3,
    level: "advanced",
    language: "python",
    title: "Rectangle Area",
    description: "Calculate area of a rectangle!",
    code: `# Rectangle Area
length = 5
width = 3
area = length * width
print("Length:", length)
print("Width:", width)
print("Area:", area)`,
    challenge: "Also calculate the perimeter!",
  },
];

// Class 4 Examples (Ages 9-10) - Python with more logic
const class4Examples: CodeExample[] = [
  {
    id: "c4-1",
    classLevel: 4,
    level: "beginner",
    language: "python",
    title: "Variables Review",
    description: "Practice using variables!",
    code: `# My Info Card
name = "Sam"
age = 9
city = "Mumbai"
print("=== My Info ===")
print("Name:", name)
print("Age:", age)
print("City:", city)`,
    challenge: "Add more information like school name!",
  },
  {
    id: "c4-2",
    classLevel: 4,
    level: "beginner",
    language: "python",
    title: "Math Operations",
    description: "All basic math operations!",
    code: `# Math Operations
a = 15
b = 4
print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Remainder:", a % b)`,
    challenge: "Try with your own numbers!",
  },
  {
    id: "c4-3",
    classLevel: 4,
    level: "beginner",
    language: "python",
    title: "Using Lists",
    description: "Store multiple items in a list!",
    code: `# My Favorite Fruits
fruits = ["apple", "banana", "mango"]
print("My fruits:", fruits)
print("First fruit:", fruits[0])
print("I have", len(fruits), "fruits")`,
    hints: ["Lists use square brackets []", "First item is at position 0"],
    challenge: "Add more fruits to the list!",
  },
  {
    id: "c4-4",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Loop Through List",
    description: "Print each item in a list!",
    code: `# Loop Through Colors
colors = ["red", "blue", "green", "yellow"]
print("My favorite colors:")
for color in colors:
    print("-", color)`,
    challenge: "Add more colors!",
  },
  {
    id: "c4-5",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Star Pyramid",
    description: "Make a pyramid with stars!",
    code: `# Star Pyramid
rows = 5
for i in range(1, rows + 1):
    print("*" * i)`,
    expectedOutput: "*\n**\n***\n****\n*****",
    challenge: "Make it 10 rows!",
  },
  {
    id: "c4-6",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Number Pyramid",
    description: "Pyramid with numbers!",
    code: `# Number Pyramid
for i in range(1, 6):
    for j in range(1, i + 1):
        print(j, end=" ")
    print()`,
    challenge: "Make it go to 10!",
  },
  {
    id: "c4-7",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Find Maximum",
    description: "Find the biggest number!",
    code: `# Find Maximum
numbers = [5, 12, 3, 8, 15, 7]
maximum = numbers[0]
for num in numbers:
    if num > maximum:
        maximum = num
print("Numbers:", numbers)
print("Maximum:", maximum)`,
    challenge: "Also find the minimum!",
  },
  {
    id: "c4-8",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Count Vowels",
    description: "Count vowels in a word!",
    code: `# Count Vowels
word = "programming"
vowels = "aeiou"
count = 0
for letter in word:
    if letter in vowels:
        count = count + 1
print("Word:", word)
print("Vowels:", count)`,
    challenge: "Try with your name!",
  },
  {
    id: "c4-9",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Simple Function",
    description: "Create your own function!",
    code: `# My First Function
def say_hello(name):
    print("Hello,", name, "!")
    print("Welcome to coding!")

say_hello("Alex")
say_hello("Sam")`,
    hints: ["def creates a function", "Call it with function_name()"],
    challenge: "Add more greetings!",
  },
  {
    id: "c4-10",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Calculator Function",
    description: "Make a calculator with functions!",
    code: `# Calculator Functions
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

print("5 + 3 =", add(5, 3))
print("4 x 6 =", multiply(4, 6))`,
    challenge: "Add subtract and divide functions!",
  },
  {
    id: "c4-11",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Factorial",
    description: "Calculate factorial of a number!",
    code: `# Factorial
num = 5
factorial = 1
for i in range(1, num + 1):
    factorial = factorial * i
print(num, "! =", factorial)`,
    hints: ["5! = 5 x 4 x 3 x 2 x 1 = 120"],
    challenge: "Calculate 7!",
  },
  {
    id: "c4-12",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Fibonacci Sequence",
    description: "Print Fibonacci numbers!",
    code: `# Fibonacci Sequence
n = 10
a, b = 0, 1
print("Fibonacci sequence:")
for i in range(n):
    print(a, end=" ")
    a, b = b, a + b`,
    hints: ["Each number is sum of previous two"],
    challenge: "Print 15 Fibonacci numbers!",
  },
  {
    id: "c4-13",
    classLevel: 4,
    level: "beginner",
    language: "python",
    title: "Temperature Check",
    description: "Check if it's hot or cold!",
    code: `# Temperature Check
temp = 35
if temp >= 30:
    print("It's hot!")
elif temp >= 20:
    print("Nice weather!")
else:
    print("It's cold!")`,
    challenge: "Add more temperature ranges!",
  },
  {
    id: "c4-14",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Reverse String",
    description: "Reverse a word!",
    code: `# Reverse String
word = "hello"
reversed_word = word[::-1]
print("Original:", word)
print("Reversed:", reversed_word)`,
    hints: ["[::-1] reverses a string"],
    challenge: "Reverse your name!",
  },
  {
    id: "c4-15",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Sum of List",
    description: "Add all numbers in a list!",
    code: `# Sum of List
numbers = [1, 2, 3, 4, 5]
total = 0
for num in numbers:
    total = total + num
print("Numbers:", numbers)
print("Sum:", total)`,
    challenge: "Also calculate the average!",
  },
  {
    id: "c4-16",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Prime Check",
    description: "Check if a number is prime!",
    code: `# Prime Check
num = 17
is_prime = True
for i in range(2, num):
    if num % i == 0:
        is_prime = False
        break
if is_prime:
    print(num, "is a prime number!")
else:
    print(num, "is not prime")`,
    challenge: "Check numbers 1 to 20!",
  },
  {
    id: "c4-17",
    classLevel: 4,
    level: "beginner",
    language: "python",
    title: "Shopping List",
    description: "Manage a shopping list!",
    code: `# Shopping List
items = ["milk", "bread", "eggs"]
print("Shopping List:")
for i, item in enumerate(items, 1):
    print(i, ".", item)
print("Total items:", len(items))`,
    challenge: "Add more items!",
  },
  {
    id: "c4-18",
    classLevel: 4,
    level: "intermediate",
    language: "python",
    title: "Diamond Pattern",
    description: "Draw a diamond shape!",
    code: `# Diamond Pattern
n = 5
# Upper half
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2*i - 1))
# Lower half
for i in range(n - 1, 0, -1):
    print(" " * (n - i) + "*" * (2*i - 1))`,
    challenge: "Make it bigger!",
  },
  {
    id: "c4-19",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Guess the Number",
    description: "Number guessing game logic!",
    code: `# Guess the Number
secret = 7
guesses = [3, 5, 7, 9]
for guess in guesses:
    if guess == secret:
        print(guess, "- Correct!")
    elif guess < secret:
        print(guess, "- Too low!")
    else:
        print(guess, "- Too high!")`,
    challenge: "Change the secret number!",
  },
  {
    id: "c4-20",
    classLevel: 4,
    level: "advanced",
    language: "python",
    title: "Word Counter",
    description: "Count words in a sentence!",
    code: `# Word Counter
sentence = "I love to code in Python"
words = sentence.split()
print("Sentence:", sentence)
print("Word count:", len(words))
print("Words:", words)`,
    challenge: "Count characters too!",
  },
];

// Class 5 Examples (Ages 10-11) - More Python + intro to JavaScript
const class5Examples: CodeExample[] = [
  {
    id: "c5-1",
    classLevel: 5,
    level: "beginner",
    language: "python",
    title: "Dictionary Basics",
    description: "Store data in dictionaries!",
    code: `# Dictionary Example
student = {
    "name": "Riya",
    "age": 10,
    "class": 5
}
print("Name:", student["name"])
print("Age:", student["age"])
print("Class:", student["class"])`,
    hints: ["Dictionaries use key-value pairs"],
    challenge: "Add more student information!",
  },
  {
    id: "c5-2",
    classLevel: 5,
    level: "beginner",
    language: "javascript",
    title: "Hello JavaScript",
    description: "Your first JavaScript program!",
    code: `// Hello JavaScript!
console.log("Hello, World!");
console.log("I'm learning JavaScript!");

let name = "Alex";
console.log("My name is " + name);`,
    challenge: "Change the name to yours!",
  },
  {
    id: "c5-3",
    classLevel: 5,
    level: "intermediate",
    language: "python",
    title: "List Comprehension",
    description: "Create lists the Pythonic way!",
    code: `# List Comprehension
# Old way
squares_old = []
for i in range(1, 6):
    squares_old.append(i * i)

# New way - List Comprehension
squares = [i * i for i in range(1, 6)]
print("Squares:", squares)`,
    hints: ["List comprehension is shorter!"],
    challenge: "Create cubes list!",
  },
  {
    id: "c5-4",
    classLevel: 5,
    level: "intermediate",
    language: "javascript",
    title: "JavaScript Functions",
    description: "Create functions in JavaScript!",
    code: `// JavaScript Functions
function greet(name) {
    console.log("Hello, " + name + "!");
}

function add(a, b) {
    return a + b;
}

greet("World");
console.log("5 + 3 =", add(5, 3));`,
    challenge: "Create a multiply function!",
  },
  {
    id: "c5-5",
    classLevel: 5,
    level: "intermediate",
    language: "python",
    title: "File-like Data",
    description: "Work with structured data!",
    code: `# Student Records
students = [
    {"name": "Ali", "marks": 85},
    {"name": "Priya", "marks": 92},
    {"name": "John", "marks": 78}
]

print("Student Marks:")
for s in students:
    print(s["name"], ":", s["marks"])`,
    challenge: "Calculate the class average!",
  },
  {
    id: "c5-6",
    classLevel: 5,
    level: "intermediate",
    language: "javascript",
    title: "JavaScript Arrays",
    description: "Work with arrays in JavaScript!",
    code: `// JavaScript Arrays
let fruits = ["apple", "banana", "mango"];
console.log("Fruits:", fruits);
console.log("First:", fruits[0]);
console.log("Count:", fruits.length);

// Loop through
for (let fruit of fruits) {
    console.log("- " + fruit);
}`,
    challenge: "Add more fruits!",
  },
  {
    id: "c5-7",
    classLevel: 5,
    level: "advanced",
    language: "python",
    title: "Bubble Sort",
    description: "Learn sorting algorithm!",
    code: `# Bubble Sort
numbers = [64, 34, 25, 12, 22]
print("Before:", numbers)

n = len(numbers)
for i in range(n):
    for j in range(0, n-i-1):
        if numbers[j] > numbers[j+1]:
            numbers[j], numbers[j+1] = numbers[j+1], numbers[j]

print("After:", numbers)`,
    hints: ["Compare adjacent elements", "Swap if out of order"],
    challenge: "Sort in descending order!",
  },
  {
    id: "c5-8",
    classLevel: 5,
    level: "advanced",
    language: "python",
    title: "Binary Search",
    description: "Fast searching algorithm!",
    code: `# Binary Search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11, 13]
result = binary_search(nums, 7)
print("Found 7 at index:", result)`,
    hints: ["Array must be sorted", "Divide and conquer"],
    challenge: "Search for different numbers!",
  },
  {
    id: "c5-9",
    classLevel: 5,
    level: "beginner",
    language: "python",
    title: "String Methods",
    description: "Useful string operations!",
    code: `# String Methods
text = "Hello Python"
print("Original:", text)
print("Upper:", text.upper())
print("Lower:", text.lower())
print("Length:", len(text))
print("Replace:", text.replace("Python", "World"))`,
    challenge: "Try more string methods!",
  },
  {
    id: "c5-10",
    classLevel: 5,
    level: "intermediate",
    language: "javascript",
    title: "JavaScript Objects",
    description: "Objects in JavaScript!",
    code: `// JavaScript Objects
let person = {
    name: "Sam",
    age: 10,
    city: "Delhi"
};

console.log("Name:", person.name);
console.log("Age:", person.age);

// Add new property
person.school = "ABC School";
console.log("School:", person.school);`,
    challenge: "Add more properties!",
  },
  {
    id: "c5-11",
    classLevel: 5,
    level: "intermediate",
    language: "python",
    title: "2D Lists",
    description: "Tables and matrices!",
    code: `# 2D List (Matrix)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print("Matrix:")
for row in matrix:
    print(row)

print("Element at [1][2]:", matrix[1][2])`,
    challenge: "Calculate the sum of all elements!",
  },
  {
    id: "c5-12",
    classLevel: 5,
    level: "advanced",
    language: "python",
    title: "Recursion",
    description: "Functions that call themselves!",
    code: `# Recursion - Factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("5! =", factorial(5))
print("7! =", factorial(7))`,
    hints: ["Base case stops recursion", "Function calls itself"],
    challenge: "Write recursive sum function!",
  },
  {
    id: "c5-13",
    classLevel: 5,
    level: "beginner",
    language: "python",
    title: "Random Numbers",
    description: "Generate random numbers!",
    code: `# Random Numbers
import random

print("Random 1-10:", random.randint(1, 10))
print("Random 1-100:", random.randint(1, 100))

# Random from list
colors = ["red", "blue", "green"]
print("Random color:", random.choice(colors))`,
    challenge: "Create a dice roller!",
  },
  {
    id: "c5-14",
    classLevel: 5,
    level: "intermediate",
    language: "javascript",
    title: "Arrow Functions",
    description: "Modern JavaScript syntax!",
    code: `// Arrow Functions
const add = (a, b) => a + b;
const square = x => x * x;

console.log("5 + 3 =", add(5, 3));
console.log("4² =", square(4));

// Array with arrow functions
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(x => x * 2);
console.log("Doubled:", doubled);`,
    challenge: "Create a triple function!",
  },
  {
    id: "c5-15",
    classLevel: 5,
    level: "advanced",
    language: "python",
    title: "Class Introduction",
    description: "Create your first class!",
    code: `# Simple Class
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        print(self.name, "says Woof!")

my_dog = Dog("Buddy", 3)
print("Name:", my_dog.name)
print("Age:", my_dog.age)
my_dog.bark()`,
    hints: ["Classes are blueprints", "__init__ is constructor"],
    challenge: "Add more methods!",
  },
  {
    id: "c5-16",
    classLevel: 5,
    level: "beginner",
    language: "python",
    title: "Tuple Basics",
    description: "Immutable sequences!",
    code: `# Tuples
coordinates = (10, 20)
colors = ("red", "green", "blue")

print("Coordinates:", coordinates)
print("X:", coordinates[0])
print("Y:", coordinates[1])
print("Colors:", colors)`,
    hints: ["Tuples can't be changed"],
    challenge: "Create a date tuple (day, month, year)!",
  },
  {
    id: "c5-17",
    classLevel: 5,
    level: "intermediate",
    language: "python",
    title: "Set Operations",
    description: "Work with sets!",
    code: `# Set Operations
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

print("Set 1:", set1)
print("Set 2:", set2)
print("Union:", set1 | set2)
print("Intersection:", set1 & set2)
print("Difference:", set1 - set2)`,
    challenge: "Find elements only in set2!",
  },
  {
    id: "c5-18",
    classLevel: 5,
    level: "advanced",
    language: "javascript",
    title: "Array Methods",
    description: "Powerful array operations!",
    code: `// Array Methods
const nums = [1, 2, 3, 4, 5];

// Filter even numbers
const evens = nums.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Sum using reduce
const sum = nums.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);

// Check if any > 3
console.log("Any > 3:", nums.some(n => n > 3));`,
    challenge: "Filter numbers greater than 2!",
  },
  {
    id: "c5-19",
    classLevel: 5,
    level: "intermediate",
    language: "python",
    title: "Exception Handling",
    description: "Handle errors gracefully!",
    code: `# Exception Handling
def divide(a, b):
    try:
        result = a / b
        print(f"{a} / {b} = {result}")
    except ZeroDivisionError:
        print("Error: Can't divide by zero!")

divide(10, 2)
divide(5, 0)`,
    hints: ["try-except catches errors"],
    challenge: "Handle other error types!",
  },
  {
    id: "c5-20",
    classLevel: 5,
    level: "advanced",
    language: "python",
    title: "Lambda Functions",
    description: "Short anonymous functions!",
    code: `# Lambda Functions
square = lambda x: x * x
add = lambda a, b: a + b

print("5² =", square(5))
print("3 + 4 =", add(3, 4))

# With sorted
students = [("Ali", 85), ("Zara", 92), ("Priya", 78)]
by_marks = sorted(students, key=lambda x: x[1], reverse=True)
print("Sorted by marks:", by_marks)`,
    challenge: "Sort by name instead!",
  },
];

// Classes 6-10 would follow similar patterns with increasing complexity
// Including C, C++, Java examples for higher classes

// Class 6 Examples
const class6Examples: CodeExample[] = [
  {
    id: "c6-1", classLevel: 6, level: "beginner", language: "python",
    title: "Functions Deep Dive",
    description: "Multiple return values!",
    code: `def min_max(numbers):
    return min(numbers), max(numbers)

nums = [3, 1, 4, 1, 5, 9, 2, 6]
minimum, maximum = min_max(nums)
print(f"Min: {minimum}, Max: {maximum}")`,
    challenge: "Return mean too!",
  },
  {
    id: "c6-2", classLevel: 6, level: "intermediate", language: "python",
    title: "File Simulation",
    description: "Simulating file operations!",
    code: `# Simulated file data
file_content = """Name,Age,City
Alice,12,Delhi
Bob,11,Mumbai
Carol,12,Chennai"""

lines = file_content.strip().split("\\n")
header = lines[0].split(",")
print("Headers:", header)
for line in lines[1:]:
    data = line.split(",")
    print(f"{data[0]} is {data[1]} years old from {data[2]}")`,
    challenge: "Add more data!",
  },
  {
    id: "c6-3", classLevel: 6, level: "advanced", language: "c",
    title: "Hello C",
    description: "First C program!",
    code: `#include <stdio.h>

int main() {
    printf("Hello, C Programming!\\n");
    int a = 10, b = 5;
    printf("Sum: %d\\n", a + b);
    return 0;
}`,
    challenge: "Add subtraction!",
  },
  // Continue with more examples...
  {
    id: "c6-4", classLevel: 6, level: "intermediate", language: "javascript",
    title: "DOM Concepts",
    description: "Understanding web elements!",
    code: `// DOM-like simulation
const elements = {
  header: "Welcome to My Page",
  content: "This is the main content.",
  footer: "Copyright 2024"
};

for (const [key, value] of Object.entries(elements)) {
  console.log(\`<\${key}>\${value}</\${key}>\`);
}`,
    challenge: "Add more elements!",
  },
  {
    id: "c6-5", classLevel: 6, level: "beginner", language: "python",
    title: "List Slicing",
    description: "Extract parts of lists!",
    code: `nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print("All:", nums)
print("First 5:", nums[:5])
print("Last 3:", nums[-3:])
print("Middle:", nums[3:7])
print("Every 2nd:", nums[::2])
print("Reversed:", nums[::-1])`,
    challenge: "Get odd-indexed elements!",
  },
  {
    id: "c6-6", classLevel: 6, level: "intermediate", language: "python",
    title: "Nested Loops Pattern",
    description: "Complex patterns with nested loops!",
    code: `# Hollow Square
n = 5
for i in range(n):
    for j in range(n):
        if i == 0 or i == n-1 or j == 0 or j == n-1:
            print("*", end="")
        else:
            print(" ", end="")
    print()`,
    challenge: "Make a hollow diamond!",
  },
  {
    id: "c6-7", classLevel: 6, level: "advanced", language: "python",
    title: "OOP - Inheritance",
    description: "Classes inheriting from others!",
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
cat = Cat("Whiskers")
print(dog.speak())
print(cat.speak())`,
    challenge: "Add a Bird class!",
  },
  {
    id: "c6-8", classLevel: 6, level: "beginner", language: "c",
    title: "C Variables",
    description: "Different data types in C!",
    code: `#include <stdio.h>

int main() {
    int age = 12;
    float height = 4.5;
    char grade = 'A';
    
    printf("Age: %d\\n", age);
    printf("Height: %.1f ft\\n", height);
    printf("Grade: %c\\n", grade);
    return 0;
}`,
    challenge: "Add a double variable!",
  },
  {
    id: "c6-9", classLevel: 6, level: "intermediate", language: "c",
    title: "C Loops",
    description: "Loops in C!",
    code: `#include <stdio.h>

int main() {
    printf("Counting: ");
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    
    // Times table
    int n = 5;
    printf("\\n%d times table:\\n", n);
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\\n", n, i, n*i);
    }
    return 0;
}`,
    challenge: "Add while loop!",
  },
  {
    id: "c6-10", classLevel: 6, level: "advanced", language: "c",
    title: "C Arrays",
    description: "Working with arrays in C!",
    code: `#include <stdio.h>

int main() {
    int nums[] = {10, 20, 30, 40, 50};
    int sum = 0;
    int n = 5;
    
    printf("Array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", nums[i]);
        sum += nums[i];
    }
    printf("\\nSum: %d\\n", sum);
    printf("Average: %.2f\\n", (float)sum/n);
    return 0;
}`,
    challenge: "Find max and min!",
  },
  { id: "c6-11", classLevel: 6, level: "beginner", language: "python", title: "Enumerate", description: "Get index with item!", code: `fruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(f"{i+1}. {fruit}")`, challenge: "Start from 10!" },
  { id: "c6-12", classLevel: 6, level: "intermediate", language: "python", title: "Zip Function", description: "Combine lists!", code: `names = ["Ali", "Sara"]\nages = [12, 11]\nfor name, age in zip(names, ages):\n    print(f"{name} is {age}")`, challenge: "Add cities!" },
  { id: "c6-13", classLevel: 6, level: "intermediate", language: "javascript", title: "Template Literals", description: "Modern strings!", code: `const name = "Alex";\nconst age = 12;\nconsole.log(\`Hi, I'm \${name} and I'm \${age} years old!\`);`, challenge: "Add more variables!" },
  { id: "c6-14", classLevel: 6, level: "advanced", language: "python", title: "Generators", description: "Memory efficient iteration!", code: `def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor num in countdown(5):\n    print(num)`, challenge: "Create evens generator!" },
  { id: "c6-15", classLevel: 6, level: "beginner", language: "python", title: "F-strings", description: "Formatted strings!", code: `name = "Python"\nversion = 3.11\nprint(f"Hello {name} {version}!")\nprint(f"2 + 2 = {2+2}")`, challenge: "Format numbers!" },
  { id: "c6-16", classLevel: 6, level: "intermediate", language: "c", title: "C Functions", description: "Functions in C!", code: `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("5 + 3 = %d\\n", add(5, 3));\n    return 0;\n}`, challenge: "Add multiply!" },
  { id: "c6-17", classLevel: 6, level: "advanced", language: "python", title: "Decorators Intro", description: "Function wrappers!", code: `def timer(func):\n    def wrapper():\n        print("Starting...")\n        func()\n        print("Done!")\n    return wrapper\n\n@timer\ndef say_hello():\n    print("Hello!")\n\nsay_hello()`, challenge: "Add timing!" },
  { id: "c6-18", classLevel: 6, level: "beginner", language: "javascript", title: "Destructuring", description: "Extract values!", code: `const person = { name: "Ali", age: 12 };\nconst { name, age } = person;\nconsole.log(name, age);\n\nconst [a, b] = [1, 2];\nconsole.log(a, b);`, challenge: "Try nested!" },
  { id: "c6-19", classLevel: 6, level: "intermediate", language: "python", title: "Dict Comprehension", description: "Create dicts elegantly!", code: `squares = {x: x*x for x in range(1, 6)}\nprint(squares)`, challenge: "Create cubes dict!" },
  { id: "c6-20", classLevel: 6, level: "advanced", language: "c", title: "C Pointers Intro", description: "Address operations!", code: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *p = &x;\n    printf("Value: %d\\n", x);\n    printf("Address: %p\\n", (void*)p);\n    printf("Via pointer: %d\\n", *p);\n    return 0;\n}`, challenge: "Change value via pointer!" },
];

// Generate remaining class examples (7-10) with similar patterns
const generateRemainingClasses = (): CodeExample[] => {
  const examples: CodeExample[] = [];
  
  // Class 7-10 would have more C++, Java examples
  // For brevity, adding a few key examples per class
  
  // Class 7
  for (let i = 1; i <= 20; i++) {
    examples.push({
      id: `c7-${i}`,
      classLevel: 7,
      level: i <= 7 ? "beginner" : i <= 14 ? "intermediate" : "advanced",
      language: i <= 10 ? "python" : i <= 15 ? "cpp" : "java",
      title: `Class 7 Example ${i}`,
      description: "Advanced concepts",
      code: i <= 10 
        ? `# Python Example ${i}\nprint("Class 7 Python ${i}")`
        : i <= 15 
        ? `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "C++ Example ${i}" << endl;\n    return 0;\n}`
        : `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Java Example ${i}");\n    }\n}`,
      challenge: "Modify and explore!",
    });
  }
  
  // Class 8-10
  for (let classNum = 8; classNum <= 10; classNum++) {
    for (let i = 1; i <= 20; i++) {
      examples.push({
        id: `c${classNum}-${i}`,
        classLevel: classNum,
        level: i <= 7 ? "beginner" : i <= 14 ? "intermediate" : "advanced",
        language: i <= 8 ? "python" : i <= 14 ? "cpp" : "java",
        title: `Class ${classNum} Example ${i}`,
        description: "Advanced programming",
        code: i <= 8 
          ? `# Python Example ${i}\n# Class ${classNum} concepts\nimport random\nprint("Random:", random.randint(1, 100))`
          : i <= 14 
          ? `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> v = {1,2,3};\n    for(int x : v) cout << x << " ";\n    return 0;\n}`
          : `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = Arrays.asList(1,2,3);\n        list.forEach(System.out::println);\n    }\n}`,
        challenge: "Expand this program!",
      });
    }
  }
  
  return examples;
};

// Combine all examples
export const allCodeExamples: CodeExample[] = [
  ...class3Examples,
  ...class4Examples,
  ...class5Examples,
  ...class6Examples,
  ...generateRemainingClasses(),
];

// Helper functions
export const getExamplesByClass = (classLevel: number): CodeExample[] => {
  return allCodeExamples.filter(e => e.classLevel === classLevel);
};

export const getExamplesByLevel = (level: "beginner" | "intermediate" | "advanced"): CodeExample[] => {
  return allCodeExamples.filter(e => e.level === level);
};

export const getExamplesByLanguage = (language: string): CodeExample[] => {
  return allCodeExamples.filter(e => e.language === language);
};

export const filterExamples = (
  classLevel?: number,
  level?: "beginner" | "intermediate" | "advanced",
  language?: string
): CodeExample[] => {
  return allCodeExamples.filter(e => {
    if (classLevel && e.classLevel !== classLevel) return false;
    if (level && e.level !== level) return false;
    if (language && e.language !== language) return false;
    return true;
  });
};