import uuid

from pydantic import EmailStr
from sqlalchemy import Column, Text
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    url: str | None = Field(unique=True, default=None, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class UserDetailsBase(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    intro: str | None = Field(default=None, max_length=512)
    avatar: str | None = None
    about: str | None = Field(default=None, sa_column=Column(Text))
    extra: str | None = Field(default=None, sa_column=Column(Text))
    work_station_url: str | None = None


class UserDetailsCreate(UserDetailsBase):
    pass


class UserDetailsUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    intro: str | None = Field(default=None, max_length=512)
    avatar: str | None = None
    about: str | None = None
    extra: str | None = None
    work_station_url: str | None = None


class UserDetails(UserDetailsBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", unique=True, index=True, nullable=False
    )

    user: "User" = Relationship(back_populates="details")


class UserDetailsPublic(UserDetailsBase):
    id: uuid.UUID
    user_id: uuid.UUID


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

    details: UserDetails | None = Relationship(
        back_populates="user",
        sa_relationship_kwargs={
            "uselist": False,
            "cascade": "all, delete-orphan",
            "single_parent": True,
        },
    )


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None
