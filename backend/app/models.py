import uuid

from pydantic import EmailStr
from sqlalchemy import Column, Text, UniqueConstraint
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


class SkillCategoryBase(SQLModel):
    title: str = Field(max_length=255, index=True)
    icon: str | None = Field(default=None, max_length=64)
    color: str | None = Field(default=None, max_length=16)
    order: int | None = Field(default=None)


class SkillBase(SQLModel):
    name: str = Field(max_length=255, index=True)
    order: int | None = Field(default=None)


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=64)
    color: str | None = Field(default=None, max_length=16)
    order: int | None = None


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    order: int | None = None


class SkillCategoryLink(SQLModel, table=True):
    __tablename__ = "skill_category_link"
    __table_args__ = (
        UniqueConstraint("skill_id", "category_id", name="uq_skill_category_pair"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    user_id: uuid.UUID = Field(foreign_key="user.id", index=True, nullable=False)

    skill_id: uuid.UUID = Field(foreign_key="skill.id", index=True, nullable=False)
    category_id: uuid.UUID = Field(
        foreign_key="skillcategory.id", index=True, nullable=False
    )


class SkillCategory(SkillCategoryBase, table=True):
    __tablename__ = "skillcategory"
    __table_args__ = (
        UniqueConstraint("user_id", "title", name="uq_skillcategory_user_title"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True, nullable=False)

    skills: list["Skill"] = Relationship(
        back_populates="categories",
        link_model=SkillCategoryLink,
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    user: User | None = Relationship()


class Skill(SkillBase, table=True):
    __tablename__ = "skill"
    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_skill_user_name"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True, nullable=False)

    categories: list[SkillCategory] = Relationship(
        back_populates="skills",
        link_model=SkillCategoryLink,
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    user: User | None = Relationship()


class SkillPublic(SkillBase):
    id: uuid.UUID
    user_id: uuid.UUID


class SkillCategoryPublic(SkillCategoryBase):
    id: uuid.UUID
    user_id: uuid.UUID


class SkillCategoryWithSkills(SkillCategoryPublic):
    skills: list[SkillPublic] = []


class SkillsPublic(SQLModel):
    data: list[SkillPublic]
    count: int


class SkillCategoriesPublic(SQLModel):
    data: list[SkillCategoryPublic]
    count: int
