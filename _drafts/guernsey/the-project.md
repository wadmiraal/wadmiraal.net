The idea is to build the functionality for a book sharing club.

- Users can create their own bookshelf.
- Rate and comment on books they own.
- Find other books owned by other users.
- Flag a book as "I'd like to read this one"

## Functionality:
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

## Custom Entity: Book

Here, we need to first write some boilerplate code, before it makes sense to write our tests. Entities in Drupal follow strict rules, and we have to follow them.

Boilerplate code:

````php
<?php

namespace Drupal\guernsey\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\user\EntityOwnerInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

class Book extends ContentEntityBase implements  ContentEntityInterface, EntityOwnerInterface, EntityChangedInterface {
  
  /**
   * {@inheritdoc}
   */
  public function setChangedTime($timestamp) {
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getChangedTime() {
    return time();
  }

  /**
   * {@inheritdoc}
   */
  public function getChangedTimeAcrossTranslations()  {
    return time();
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return null;
  }
  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return null;
  }

}
````
