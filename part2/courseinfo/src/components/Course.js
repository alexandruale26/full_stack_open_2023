const Header = ({ course }) => <h2>{course.name}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ course }) => (
  <div>
    {course.parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Total = ({ course }) => (
  <strong>total of {course.parts.reduce((sum, part) => (sum += part.exercises), 0)} exercises</strong>
);

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </div>
);

export default Course;
