import Storage from "./Storage";

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();;
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        // running the private Methods here--
        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.querySelector('#limit').value = this._calorieLimit;
    }

    // Public Methods //
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);

        this._render();
    }

    addWorkouts(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);

        this._render();
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);
        if(index !== -1) {
            const meal = this._meals[index];
            this._totalCalories -= meal.calories;
            Storage.setTotalCalories(this._totalCalories);
            this._meals.splice(index, 1);
            Storage.removeMeal(id);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if(index !== -1) {
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.setTotalCalories(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCalorieLimit();
        this._render();
    }

    loadItems() {
        this._meals.forEach((meal) => this._displayNewMeal(meal));
        this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }

    // Private Methods //
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.querySelector('#calories-total');
        totalCaloriesEl.textContent = this._totalCalories;
    }

    _displayCalorieLimit() {
        const calorieLimitEl = document.querySelector('#calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const calorieConsumedEl = document.querySelector('#calories-consumed');
        let totalConsumption = 0;
        this._meals.forEach((item) => {
            totalConsumption += item.calories;
        })
        calorieConsumedEl.textContent = totalConsumption;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.querySelector('#calories-burned');

        const burnedCalories = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.textContent = burnedCalories;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainEl = document.querySelector('#calories-remaining');
        const remainingCalories = this._calorieLimit - this._totalCalories;
        caloriesRemainEl.textContent = remainingCalories;

        if(remainingCalories <= 0) {
            caloriesRemainEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainEl.parentElement.parentElement.classList.add('text-bg-danger');
        }
        else {
            caloriesRemainEl.parentElement.parentElement.classList.remove('text-bg-danger');
            caloriesRemainEl.parentElement.parentElement.classList.add('bg-light');
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.querySelector('#calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        progressEl.style.width = `${width}%`;

        if(width >= 100) {
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }
        else {
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayNewMeal(meal) {
        const mealsEl = document.querySelector('#meal-items');

        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('d-flex', 'align-items-center', 'justify-content-between');

        const h4 = document.createElement('h4');
        h4.classList.add('mx-1');
        h4.textContent = meal.name;
        const childDiv = document.createElement('div');
        childDiv.classList.add('fs-1', 'text-bg-primary', 'text-center', 'rounded-2', 'px-2','px-sm-4', 'me-lg-5', 'ms-lg-3');
        childDiv.textContent = meal.calories;
        const button = document.createElement('button');
        button.classList.add('delete', 'btn', 'btn-danger', 'btn-sm', 'mx-2');
        button.setAttribute('type', 'button');
        button.innerHTML = '<i class="fa-solid fa-xmark"></i>Close';

        flexDiv.appendChild(h4);
        flexDiv.appendChild(childDiv);
        flexDiv.appendChild(button);
        
        cardBody.appendChild(flexDiv);
        mealEl.appendChild(cardBody);

        mealsEl.appendChild(mealEl);
    }

    _displayNewWorkout(workout) {
        const workoutEl = document.querySelector('#workout-items');

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'my-2');
        cardDiv.setAttribute('data-id', workout.id);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const flexDiv = document.createElement('div');
        flexDiv.classList.add('d-flex', 'align-items-center', 'justify-content-between');

        const h4 = document.createElement('h4');
        h4.className = 'mx-1';
        h4.textContent = workout.name;

        const childDiv = document.createElement('div');
        childDiv.classList.add('fs-1', 'text-bg-success', 'text-center', 'rounded-2', 'px-2', 'px-sm-4');
        childDiv.textContent = workout.calories;

        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('delete', 'btn', 'btn-danger', 'btn-sm', 'mx-2');
        button.innerHTML = `<i class="fa-solid fa-xmark"></i>Close`;

        flexDiv.appendChild(h4);
        flexDiv.appendChild(childDiv);
        flexDiv.appendChild(button);

        cardBody.appendChild(flexDiv);
        cardDiv.appendChild(cardBody);

        workoutEl.appendChild(cardDiv);
    }

    // Render on DOM after Changes //
    _render() {
        this._displayCaloriesTotal();
        this._displayCalorieLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

export default CalorieTracker;