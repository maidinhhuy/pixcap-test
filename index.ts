interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface Action {
  employeeID: number;
  supervisorID: number;

}

interface IEmployeeOrgApp {

  ceo: Employee

  /**
   * Moves the employee with employeeID (uniqueId) under a supervisor
   (another employee) that has supervisorID (uniqueId).
   * E.g. move Bob (employeeID) to be subordinate of Georgina
   (supervisorID). * @param employeeID
   * @param supervisorID
   * @param employeeID
   */
  move(employeeID: number, supervisorID: number): void;

  /** Undo last move action */
  undo(): void;

  /** Redo last undone action */
  redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee
  moveHistory: Array<Action>
  redoHistory: Array<Action>

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.moveHistory = [];
    this.redoHistory = []
  }

  // Add employee to new supervisor
  add(node: Employee, employee: Employee, supervisorID: number, action: string): any {
    for (let i = 0; i < node.subordinates.length; i++) {
      if (node.subordinates[i].uniqueId == supervisorID) {
        node.subordinates[i].subordinates.push(employee)
      } else {
        this.add(node.subordinates[i], employee, supervisorID, action)
      }
    }
  }

  // Remove employee from old supervisor
  remove(node: Employee, employeeID: number, supervisorID: number, action: string): any {
    for (let i = 0; i < node.subordinates.length; i++) {
      if (node.subordinates[i].uniqueId == employeeID) {
        let temp = node.subordinates[i]
        node.subordinates.splice(i, 1)
        // Set history for undo redo function
        switch (action) {
          case 'move':
            this.moveHistory.push({employeeID: employeeID, supervisorID: node.uniqueId});
            // Clear redo history
            this.redoHistory = []
            break;
          case 'undo':
            // Push history for redo
            if (this.moveHistory.length !== 0) {
              this.redoHistory.push({employeeID: employeeID, supervisorID: node.uniqueId});
              this.moveHistory.pop();
            }
            break
          case 'redo':
            if (this.redoHistory.length !== 0) {
              this.moveHistory.push(this.redoHistory[this.redoHistory.length - 1])
              this.redoHistory.pop()
            }
            break
        }
        this.add(this.ceo, temp, supervisorID, action)
      } else {
        this.remove(node.subordinates[i], employeeID, supervisorID, action)
      }
    }
  }

  move(employeeID: number, supervisorID: number): void {
    this.remove(this.ceo, employeeID, supervisorID, 'move')
  }

  redo(): void {
    if (this.redoHistory.length !== 0) {
      let lastAction = this.redoHistory[this.redoHistory.length - 1]
      this.remove(this.ceo, lastAction.employeeID, lastAction.supervisorID, 'redo')
    }
  }

  undo(): void {
    if (this.moveHistory.length !== 0) {
      let lastAction = this.moveHistory[this.moveHistory.length - 1]
      this.remove(this.ceo, lastAction.employeeID, lastAction.supervisorID, 'undo')
    }
  }

}

const ceo: Employee = {
  uniqueId: 1,
  name: 'Mark Zuckerberg',
  subordinates: [
    {
      uniqueId: 2,
      name: 'Sarah Donald',
      subordinates: [
        {
          uniqueId: 3,
          name: 'Cassandra Reynolds',
          subordinates: [
            {
              uniqueId: 4,
              name: 'Mary Blue',
              subordinates: []
            },
            {
              uniqueId: 5,
              name: 'Bob Saget',
              subordinates: [
                {
                  uniqueId: 6,
                  name: 'Tina Teff',
                  subordinates: [
                    {
                      uniqueId: 7,
                      name: '- Will Turner:',
                      subordinates: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      uniqueId: 8,
      name: 'Tyler Simpson',
      subordinates: [
        {
          uniqueId: 9,
          name: 'Harry Tobs',
          subordinates: [
            {
              uniqueId: 10,
              name: 'Thomas Brown:',
              subordinates: []
            }
          ]
        },
        {
          uniqueId: 11,
          name: 'George Carrey:',
          subordinates: []
        },
        {
          uniqueId: 12,
          name: 'Gary Styles',
          subordinates: []
        }
      ]
    },
    {
      uniqueId: 13,
      name: 'Bruce Willis:',
      subordinates: []
    },
    {
      uniqueId: 14,
      name: 'Georgina Flangy',
      subordinates: [
        {
          uniqueId: 15,
          name: 'Sophie Turner',
          subordinates: []
        }
      ]
    }
  ]
}

const app = new EmployeeOrgApp(ceo)
app.move(12, 3)
console.log("test move: ", JSON.stringify(app.ceo))
app.undo()
console.log("test undo: ", JSON.stringify(app.ceo))
app.redo()
console.log("test redo: ", JSON.stringify(app.ceo))

