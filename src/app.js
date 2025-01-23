import './css/style.css';
import favicon from './asset/favicon.ico';
import '@fortawesome/fontawesome-free/js/all';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Collapse} from 'bootstrap';

import CalorieTracker from './Tracker';
import {Meal, Workout} from './Item';

class App {
    constructor() {
        this._tracker = new CalorieTracker();

        this._loadEventListeners();

        this._tracker.loadItems();
    }

    _loadEventListeners() {
        document.querySelector('#meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.querySelector('#workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.querySelector('#meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.querySelector('#workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));

        document.querySelector('#filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.querySelector('#filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.querySelector('#reset').addEventListener('click', this._reset.bind(this));

        document.querySelector('#limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, event) {
        event.preventDefault();

        const name = document.querySelector(`#${type}-name`);
        const calories = document.querySelector(`#${type}-calories`);

        if(name.value === '' || calories.value === '') {
            alert('Please fill out all fields.');
            return;
        }

        if(type === 'meal') {
            const meal = new Meal(name.value, parseInt(calories.value));
            this._tracker.addMeal(meal);
        }
        else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkouts(workout);
        }

        name.value = '';
        calories.value = '';

        // Bootstrap Js to close collapse after Entering Details--
        const collapseItem = document.querySelector(`#collapse-${type}`);
        const bsCollapse = new Collapse(collapseItem, {
            toggle : true,
        });
    }

    _removeItem(type, event) {
        if(event.target.classList.contains('delete') || event.target.classList.contains('fa-xmark')) {
            if(confirm('Are you Sure?')) {
                const id = event.target.closest('.card').getAttribute('data-id');
                
                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                event.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, event) {
        const text = event.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if(name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            }
            else {
                item.style.display = 'none';
            }
        })
    }

    _reset() {
        this._tracker.reset();
        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';
    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.querySelector('#limit');
        if(limit.value === '') {
            alert('Please add a limit!');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        // To close the modal--
        const modalEl = document.querySelector('#limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}
// This is to kick or run our whole application--
const app = new App();