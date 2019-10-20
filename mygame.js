Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}
Game.makeCombination = function(item1, item2, item3){

           game.makeCombination(item1.id, item2.id, item3.id)

}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}else{
		printMessage("문이 잠겨있다.")
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})


/////////////////////////////////////////////////////////////게임

room1 = new Room('room1', '배경-1.png')
room2 = new Room('room2','화장실.jpg')
room3 = new Room('room3','작은방.jpg')



/////////////room1


room1.door1 = new Door(room1, 'door1', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room2)
room1.door1.resize(120)
room1.door1.locate(1049, 320)
room1.door1.lock()

room1.keypad2 = new Object(room1, 'keypad2', '숫자키-우.png')
room1.keypad2.resize(50)
room1.keypad2.locate(1150,300)
room1.keypad2.onClick = function() {
	printMessage("비밀번호를 입력하세요.(NEWS)")
	showKeypad("number", "6423" , function(){
		room1.door1.unlock()
		printMessage("잠금장치가 열리는 소리가 들렸다.")
	 })
}

room1.door2 = new Door(room1, 'door2', '문3-우-닫힘.png', '문3-우-열림.png', room3)
room1.door2.resize(120)
room1.door2.locate(700,265)
room1.door2.lock()

room1.door2.onClick = function(){
	if (room2.key.isHanded() && this.id.isLocked()){
		this.id.open()
		printMessage("문이 열렸다.")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}else{
		printMessage("문이 잠겨있다.")
	}
		
}


room1.door3 = new Door(room1, 'door3', '문2-좌-닫힘.png', '문2-좌-열림.png')
room1.door3.resize(120)
room1.door3.locate(300,265)
room1.door3.lock()

room1.keypad1 = new Item(room1, 'keypad1', '키패드-좌.png')
room1.keypad1.resize(30)
room1.keypad1.locate(200,250)
room1.keypad1.onClick = function() {
	printMessage("비밀번호를 입력하세요.")
	showKeypad("telephone", "3784" , function(){
		room1.door3.unlock()
		printMessage("잠금장치가 열리는 소리가 들렸다.")
	 })
}

	

room1.drawer = new Object(room1, 'drawer', '쓰레기통-우-닫힘.png')
room1.drawer.resize(170)
room1.drawer.locate(830,380)

room1.drawer.onClick = function() {
	if(room1.drawer.isOpened()) {
		room1.drawer.close() 
	} else if(room1.drawer.isClosed()) { 
		room1.drawer.open()
	} else { 
	}
}

room1.drawer.onOpen = function() { 
	room1.drawer.setSprite("쓰레기통-우-열림.png")
	room1.pocket.show()
}

room1.drawer.onClose = function() {
	room1.drawer.setSprite("쓰레기통-우-닫힘.png")
	room1.pocket.hide()
}

room1.pocket = new Item(room1, 'pocket', '주머니.png')
room1.pocket.resize(48)
room1.pocket.locate(820,390)
room1.pocket.onClick = function(){
	room1.pocket.pick()
	printMessage("주머니가 무거운거 보니 안에 무언가 들어있는거 같다.")	
}
room1.pocket.hide()

room1.pocket1 = new Item(room1, 'pocket1', '주머니.png')
room1.pocket1.hide()

room1.magnet = new Item(room1, 'magnet', '자석.png')
room1.magnet.hide()

game.makeCombination(room1.pocket1.id, room1.magnet.id, room1.pocket.id)

room1.key1 = new Item(room1, 'key1', '열쇠.png')
room1.key1.resize(0)

room1.bottle = new Item(room1, 'bottle', '약통.png')
room1.bottle.resize(40)
room1.bottle.locate(300,500)
room1.bottle.onClick = function(){
	room1.bottle.pick()
	printMessage("특수용액이 든거같은 분무기를 주웠다.")	
}

room1.spot = new Object(room1,'spot','얼룩.png')
room1.spot.resize(230)
room1.spot.locate(870,180)
room1.spot.lock()

room1.spot.onClick = function(){
	if(room2.tower2.isHanded()&&room1.spot.isLocked()){
		room1.spot.open()
		printMessage("얼룩이 지워졌다.")		
	}else if(room1.spot.isOpened()){
		showImageViewer("힌트.png", "")
	}else{
		printMessage("낙서가 되어있다.")
	}
}

room1.spot.onOpen = function() { 
	room1.spot.setSprite("힌트.png")
	room1.spot.resize(200)
}

room1.hint2 =new Object(room1,'hint2','쓰레기1.png')
room1.hint2.resize(40)
room1.hint2.locate(580,430)

room1.hint1 =new Object(room1,'hint1','힌트2.png')
room1.hint1.hide()

room1.hint2.onClick = function(){
	room1.hint1.pick()
	printMessage("무엇인가 적혀있는 종이를 하나 주웠다.")
	room1.hint2.hide()
}


room1.deco1 = new Object(room1, 'deco1', '찬장.png')
room1.deco1.resize(130)
room1.deco1.locate(540,335)

room1.deco2 = new Object(room1, 'deco2', '찬장.png')
room1.deco2.resize(130)
room1.deco2.locate(540,225)



room1.deco3 = new Object(room1, 'deco3', '책1-1.png')
room1.deco3.resize(60)
room1.deco3.locate(700,500)

room1.deco4 = new Object(room1, 'deco4', '의자2-1.png')
room1.deco4.resize(130)
room1.deco4.locate(820,555)

room1.deco5 = new Object(room1, 'deco5', '쓰레기1.png')
room1.deco5.resize(40)
room1.deco5.locate(550,625)

room1.deco6 = new Object(room1, 'deco6', '배장식-2.png')
room1.deco6.resize(75)
room1.deco6.locate(530,125)

room1.deco7 = new Object(room1, 'deco7', 'news.png')
room1.deco7.resize(70)
room1.deco7.locate(1150,270)




///////////////////////////room2 화장실//////////////////////////////////////////////////////

room2.door = new Door(room2, 'door', '화살표.png', '화살표.png', room1)
room2.door.resize(70)
room2.door.locate(100, 400)

room2.drain = new Object(room2,'drain','하수구.png')
room2.drain.resize(100)
room2.drain.locate(550,560)
room2.drain.lock()

room2.deco = new Object(room2,'deco','수건걸이.png')
room2.deco.resize(30)
room2.deco.locate(750,180)

room2.deco2 = new Object(room2,'deco2','식물1.png')
room2.deco2.resize(120)
room2.deco2.locate(430,470)

room2.drain.onClick = function(){
	if(room1.magnet.isHanded()&&room2.drain.isLocked()){
		room2.drain.open()
		room2.key.pick()
		printMessage("자석을 이용하여 열쇠를 주웠다.")		
	}else if(room2.drain.isOpened()){
		printMessage("하수구속엔 아무것도 없다.")
	}else{
		printMessage("하수구속에 무언가 있는거 같다.")
	}
}

room2.drain.onOpen = function() { 
	room2.drain.setSprite("하수구2.png")
	room2.drain.resize(120)
}

room2.cleaner = new Item(room2,'cleaner','세제.png')
room2.cleaner.resize(70)
room2.cleaner.locate(1000,630)
room2.cleaner.onClick = function(){
	room2.cleaner.pick()
	printMessage("세제를 주웠다.")	
}

room2.tower = new Item(room2,'tower','수건.png')
room2.tower.resize(110)
room2.tower.locate(738,230)
room2.tower.onClick = function(){
	room2.tower.pick()
	printMessage("수건을 주웠다.")	
}

room2.tower2 = new Item(room2,'tower2','세제수건.png')
room2.tower2.hide()

room2.key = new Item(room2,'key','열쇠.png')
room2.key.hide()

game.makeCombination(room2.cleaner.id, room2.tower.id, room2.tower2.id)



/////////////////////작은방

room3.door = new Door(room3, 'door', '화살표.png', '화살표.png', room1)
room3.door.resize(70)
room3.door.locate(100, 350)

room3.table = new Object(room3,'table','책상.png')
room3.table.resize(450)
room3.table.locate(800,450)

room3.board = new Object(room3,'board','보드.png')
room3.board.resize(250)
room3.board.locate(480,200)
room3.board.lock()
room3.board.onClick = function(){
	if(room1.bottle.isHanded()&&room3.board.isLocked()){
		room3.board.open()
		printMessage("특수용액을 뿌리니 알 수 없는 문양이 생겼다.")		
	}else if(room3.board.isOpened()){
		showImageViewer("보드1.png", "")
	}else{
		showImageViewer("보드.png", "")
	}
}

room3.board.onOpen = function() { 
	room3.board.setSprite("보드1.png")
	room3.board.resize(250)
}

room3.computer = new Object(room3,'computer','본체.png')
room3.computer.resize(200)
room3.computer.locate(900,500)

room3.computer.onClick = function(){
	printMessage("컴퓨터 비밀번호를 입력하세요.")
	showKeypad("number",'0630',function(){
		printMessage('컴퓨터가 켜졌다.')
		room3.computer.open()
		room3.monitor.open()
		})
}

room3.computer.onOpen = function() { 
	room3.monitor.setSprite("모니터2.png")
	room3.monitor.resize(200)
}

room3.monitor = new Object(room3,'monitor','모니터.png')
room3.monitor.resize(180)
room3.monitor.locate(800,280)
room3.monitor.lock()

room3.monitor.onClick = function(){
	if(room3.monitor.isLocked()){
		printMessage("컴퓨터는 꺼져있다.")		
	}else if(room3.monitor.isOpened()){
		showImageViewer("힌트3.png", "")
	}
}


room3.deco1 = new Object(room3,'deco1','쓰레기1.png')
room3.deco1.resize(40)
room3.deco1.locate(580,580)

room3.deco2 = new Object(room3,'deco2','쓰레기1.png')
room3.deco2.resize(50)
room3.deco2.locate(800,550)

room3.deco3 = new Object(room3,'deco3','쓰레기2.png')
room3.deco3.resize(70)
room3.deco3.locate(350,600)

room3.deco4 = new Object(room3,'deco4','쓰레기통.png')
room3.deco4.resize(60)
room3.deco4.locate(600,500)




Game.start(room1, '방탈출에 오신 것을 환영합니다!')
