App.TodoItem = App.Widget.mix(
{
	constructor: function( data )
	{
		App.callMethod( 'Widget.constructor', this, [ null, 'todo-item', data.id ] );
		this.text = data.text;
		this.checked = !!data.checked;
	},
	'@template': '<li class="todo-item {{ doneclass }}" id="{{ id }}"><input type="checkbox" class="todo-check" {{ checkedattr }} /><span class="todo-label" contenteditable="true" title="Click to edit">{{ text }}</span></li>',
	'@render': function()
	{
		var checkedAttr = '',
			doneClass = '';

		if ( !!this.checked )
		{
			checkedAttr = 'checked="checked"';
			doneClass = 'todo-done';
		}

		App.callMethod( 'Widget.render', this, [
		{
			id: this.id,
			text: this.text,
			checkedattr: checkedAttr,
			doneclass: doneClass
		} ] );
	},
	update: function( todoItem, todoElement )
	{
		var text = todoElement.querySelector( '.todo-label' ).innerHTML,
			checked = !!todoElement.querySelector( '.todo-check' ).checked;

		todoItem.text = text;
		todoItem.checked = checked;

		App.Bus.publish( 'todos', 'todo:update',
		{
			todos: [
			{
				id: todoElement.id,
				text: text,
				checked: checked
			} ]
		} );
	},
	'@domEvents':
	{
		'.todo-check:change': function( event, todoItem )
		{
			var todoElement = this.parentNode;
			todoElement.classList.toggle( 'todo-done' );
			App.TodoItem.update( todoItem, todoElement );
		},
		'.todo-label:input': function( event, todoItem )
		{
			App.TodoItem.update( todoItem, this.parentNode );
		},
		'.todo-label:keypress': function( event )
		{
			if ( [ 13, 27 ].indexOf( event.keyCode ) > -1 )
			{
				event.preventDefault();
				this.blur();
				return;
			}
		}
	}
} );
