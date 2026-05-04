"use client"

export default function BookingForm() {
  function onSubmit(e) {
    e.preventDefault()
    // handle form submission
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Your name" />
      <button type="submit">Submit</button>
    </form>
  )
}