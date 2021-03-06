import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { queryClient } from '../../../../plugins/react-query';
import { lessonStore } from '../../../../store/administration/lesson.store';
import instructordeploymentStore from '../../../../store/instructordeployment.store';
import { ParamType, ValueType } from '../../../../types';
import {
  LessonPlan,
  LessonTextAreaErrors,
  LessonTimeErrors,
} from '../../../../types/services/lesson.types';
import { formatDateToIso } from '../../../../utils/date-helper';
import {
  lessonPlanTextAreaSchema,
  lessonPlanTimeSchema,
} from '../../../../validations/lesson.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IProps {
  lessonPlan: LessonPlan;
  display_label: string;
  handleChange: (_e: ValueType) => any;
  handleNext: <T>(_e: FormEvent<T>) => any;
}

function NewLessonPlan() {
  const { mutateAsync } = lessonStore.addLessonPlan();
  const { user } = useAuthenticator();
  const userId = user?.id;
  const instructor = instructordeploymentStore.getInstructorByUserId(userId + '').data
    ?.data.data[0];

  const { id } = useParams<ParamType>();

  const [lessonPlan, setlessonPlan] = useState<LessonPlan>({
    id: '',
    class_policy: '',
    end_time: '',
    grading: '',
    instructor_id: '',
    lesson_id: '',
    lesson_objective: '',
    lesson_requirements: '',
    start_time: '',
    text_books: '',
  });

  function handleChange(e: ValueType) {
    setlessonPlan({ ...lessonPlan, [e.name]: e.value });
  }

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      await mutateAsync(
        {
          ...lessonPlan,
          start_time: formatDateToIso(lessonPlan.start_time),
          end_time: formatDateToIso(lessonPlan.end_time),
          lesson_id: id,
        },
        {
          async onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['lessonplan/lesson/id']);
            history.go(-1);
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        },
      );
    }
  }

  useEffect(() => {
    setlessonPlan((lessPlan) => {
      return { ...lessPlan, instructor_id: instructor?.id + '' };
    });
  }, [instructor?.id]);

  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="w-full">
      <Stepper
        currentStep={currentStep}
        completeStep={currentStep}
        width="w-64"
        isVertical={false}
        isInline={false}
        navigateToStepHandler={() => {}}>
        <LessonTimeComponent
          display_label="info"
          lessonPlan={lessonPlan}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
        <LessonTextArea
          display_label="more"
          lessonPlan={lessonPlan}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function LessonTimeComponent({ lessonPlan, handleChange, handleNext }: IProps) {
  const initialErrorState: LessonTimeErrors = {
    start_time: '',
    end_time: '',
  };

  const [errors, setErrors] = useState<LessonTimeErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = lessonPlanTimeSchema.validate(lessonPlan, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: LessonTimeErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LessonTimeErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        required={false}
        error={errors.start_time}
        value={lessonPlan.start_time}
        name="start_time"
        type="date"
        handleChange={handleChange}>
        Start Date
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.end_time}
        value={lessonPlan.end_time}
        name="end_time"
        type="date"
        handleChange={handleChange}>
        End Date
      </InputMolecule>
      <InputMolecule
        value={lessonPlan.grading}
        name="grading"
        type="number"
        handleChange={handleChange}>
        Grading
      </InputMolecule>
      <div className="mt-5">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

function LessonTextArea({ lessonPlan, handleChange, handleNext }: IProps) {
  const initialErrorState: LessonTextAreaErrors = {
    lesson_objective: '',
    lesson_requirements: '',
    text_books: '',
    class_policy: '',
  };

  const [errors, setErrors] = useState<LessonTextAreaErrors>(initialErrorState);
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = lessonPlanTextAreaSchema.validate(lessonPlan, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: LessonTextAreaErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LessonTextAreaErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextAreaMolecule
        error={errors.lesson_objective}
        name="lesson_objective"
        value={lessonPlan.lesson_objective}
        handleChange={handleChange}>
        Lesson Objective
      </TextAreaMolecule>
      <TextAreaMolecule
        error={errors.lesson_requirements}
        name="lesson_requirements"
        value={lessonPlan.lesson_requirements}
        handleChange={handleChange}>
        Lesson Requirements
      </TextAreaMolecule>
      <TextAreaMolecule
        error={errors.text_books}
        name="text_books"
        value={lessonPlan.text_books}
        handleChange={handleChange}>
        Text Books
      </TextAreaMolecule>
      <TextAreaMolecule
        error={errors.class_policy}
        name="class_policy"
        value={lessonPlan.class_policy}
        handleChange={handleChange}>
        {t('Class')} Policy
      </TextAreaMolecule>
      <div className="mt-5">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default NewLessonPlan;
