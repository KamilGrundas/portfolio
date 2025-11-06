import uuid

from pydantic import EmailStr
from sqlalchemy import Column, Text
from sqlmodel import Field, Relationship, SQLModel


class WorkExperienceSkillLink(SQLModel, table=True):
    work_experience_id: uuid.UUID | None = Field(
        default_factory=uuid.uuid4, foreign_key="workexperience.id", primary_key=True
    )
    skill_id: uuid.UUID | None = Field(
        default_factory=uuid.uuid4, foreign_key="skill.id", primary_key=True
    )


class ProjectSkillLink(SQLModel, table=True):
    project_id: uuid.UUID | None = Field(
        default_factory=uuid.uuid4, foreign_key="project.id", primary_key=True
    )
    skill_id: uuid.UUID | None = Field(
        default_factory=uuid.uuid4, foreign_key="skill.id", primary_key=True
    )


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
    skills: list["Skill"] = Relationship(back_populates="owner")  # type: ignore
    work_experience: list["WorkExperience"] = Relationship(back_populates="owner")  # type: ignore
    education: list["Education"] = Relationship(back_populates="owner")  # type: ignore
    certificates: list["Certificate"] = Relationship(back_populates="owner")  # type: ignore


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
    name: str = Field(unique=True, max_length=100)
    icon: str | None = Field(default=None, max_length=100)
    color: str | None = Field(default=None, max_length=10)
    order: int = Field(default=0)


class SkillCategory(SkillCategoryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    skills: list["Skill"] = Relationship(back_populates="category")  # type: ignore


class SkillBase(SQLModel):
    name: str = Field(index=True, max_length=100)
    category_id: uuid.UUID | None = Field(
        foreign_key="skillcategory.id", default=None, index=True, nullable=False
    )
    order: int = Field(default=0)


class Skill(SkillBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    category: SkillCategory | None = Relationship(back_populates="skills")
    owner_id: uuid.UUID | None = Field(foreign_key="user.id", default=None, index=True)
    owner: User | None = Relationship(back_populates="skills")
    experiences: list["WorkExperience"] = Relationship(
        back_populates="skills",
        link_model=WorkExperienceSkillLink,
    )
    projects: list["Project"] = Relationship(
        back_populates="skills",
        link_model=ProjectSkillLink,
    )


class SkillCreate(SkillBase):
    pass


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=100)
    category_id: uuid.UUID | None = Field(default=None)
    order: int | None = Field(default=None)


class SkillCategoryUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=100)
    icon: str | None = Field(default=None, max_length=100)
    color: str | None = Field(default=None, max_length=10)
    order: int | None = Field(default=None)


class UserSkillsByCategory(SQLModel):
    id: uuid.UUID
    name: str
    icon: str | None
    color: str | None
    order: int
    skills: list[SkillBase] = []


class ExperienceHighlightBase(SQLModel):
    text: str | None = Field(default=None, sa_column=Column(Text))
    work_experience_id: uuid.UUID | None = Field(
        foreign_key="workexperience.id", default=None, index=True, nullable=False
    )


class ExperienceHighlight(ExperienceHighlightBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class WorkExperienceBase(SQLModel):
    company: str | None = Field(default=None, max_length=255)
    role: str | None = Field(default=None, max_length=100)
    period: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)


class WorkExperience(WorkExperienceBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID | None = Field(foreign_key="user.id", default=None, index=True)
    owner: User | None = Relationship(back_populates="work_experience")
    skills: list["Skill"] = Relationship(
        back_populates="experiences",
        link_model=WorkExperienceSkillLink,
    )


class SkillCategoryPublic(SkillCategoryBase):
    id: uuid.UUID


class SkillWithCategory(SQLModel):
    id: uuid.UUID
    name: str
    order: int = 0
    category: SkillCategoryPublic | None = None


class UserWorkExperience(SQLModel):
    company: str
    role: str
    period: str
    location: str
    highlights: list[ExperienceHighlight] = []
    skills: list[SkillWithCategory] = []


class EducationBase(SQLModel):
    school: str | None = Field(default=None, max_length=255)
    title: str | None = Field(default=None, max_length=100)
    period: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=100)
    logo_url: str | None = Field(default=None, max_length=255)


class Education(EducationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID | None = Field(foreign_key="user.id", default=None, index=True)
    owner: User | None = Relationship(back_populates="education")


class EducationCreate(EducationBase):
    owner_id: uuid.UUID


class EducationPublic(EducationBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class CertificateBase(SQLModel):
    name: str = Field(default=None, max_length=255)
    issuer: str | None = Field(default=None, max_length=255)
    issuer_logo_url: str | None = Field(default=None, max_length=255)
    issue_date: str | None = Field(default=None, max_length=100)
    credential_id: str | None = Field(default=None, max_length=100)
    credential_url: str | None = Field(default=None, max_length=255)


class Certificate(CertificateBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID | None = Field(foreign_key="user.id", default=None, index=True)
    owner: User | None = Relationship(back_populates="certificates")


class CertificateCreate(CertificateBase):
    owner_id: uuid.UUID


class CertificatePublic(CertificateBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ProjectBase(SQLModel):
    name: str = Field(default=None, max_length=255)
    source_code: str = Field(default=None, max_length=255)
    deployment_url: str = Field(default=None, max_length=255)
    description: str | None = Field(default=None, sa_column=Column(Text))
    skills: list["Skill"] = Relationship(
        back_populates="projects",
        link_model=ProjectSkillLink,
    )


class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID | None = Field(foreign_key="user.id", default=None, index=True)
    owner: User | None = Relationship(back_populates="projects")


class ProjectCreate(ProjectBase):
    owner_id: uuid.UUID


class ProjectPublic(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class UserProjects(SQLModel):
    name: str
    source_code: str
    deployment_url: str | None
    description: str | None
    skills: list[SkillWithCategory] = []
