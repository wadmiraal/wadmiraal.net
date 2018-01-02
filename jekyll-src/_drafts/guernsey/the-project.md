The idea is to build the functionality for a book sharing club.

- Users can create their own bookshelf.
- Rate and comment on books they own.
- Find other books owned by other users.
- Flag a book as "I'd like to read this one"

Functionality:
- Create books:
  - Title
  - Author (free tagging)
  - Summary
  - If exists, add a link to the existing book instead of creating a new one.
    -> Base on title alone? With authors? Suggest first?
- Click on "I own this book" when seeing an existing book not owned yet.
- Main library view, search by title/summary, filter by author.
- Only comment books owned.
- Only rate books owned.
- Only flag books not owned.

Books: custom entity
Authors: taxonomy
Rating: custom code
Flags: Flag module
